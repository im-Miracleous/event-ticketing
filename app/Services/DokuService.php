<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class DokuService
{
    protected string $clientId;
    protected string $secretKey;
    protected string $baseUrl;

    public function __construct()
    {
        $this->clientId  = config('doku.client_id');
        $this->secretKey = config('doku.secret_key');
        $this->baseUrl   = rtrim(config('doku.base_url'), '/');
    }

    /**
     * Generate DOKU SNAP signature for request.
     */
    protected function generateSignature(string $requestId, string $requestTimestamp, string $requestTarget, string $body = ''): string
    {
        // Component Signature = Client-Id + ":" + Request-Id + ":" + Request-Timestamp + ":" + Request-Target + ":" + Digest
        $digest = base64_encode(hash('sha256', $body, true));
        $componentSignature = "Client-Id:{$this->clientId}\nRequest-Id:{$requestId}\nRequest-Timestamp:{$requestTimestamp}\nRequest-Target:{$requestTarget}\nDigest:{$digest}";

        $signature = base64_encode(hash_hmac('sha256', $componentSignature, $this->secretKey, true));

        return "HMACSHA256={$signature}";
    }

    /**
     * Create a Virtual Account payment order via DOKU.
     *
     * @param array $params [
     *   'invoice_number' => string,
     *   'amount'         => int,
     *   'customer_name'  => string,
     *   'customer_email' => string,
     *   'item_name'      => string,
     *   'channel'        => string (e.g. 'MANDIRI', 'BCA', 'BNI', 'BRI', 'PERMATA', 'CIMB')
     * ]
     * @return array|null
     */
    public function createVirtualAccount(array $params): ?array
    {
        $requestId = Str::uuid()->toString();
        $requestTimestamp = now()->toIso8601String();
        $requestTarget = '/checkout/v1/payment';

        $expiryMinutes = config('doku.expiry_minutes', 60);

        $body = [
            'order' => [
                'amount'          => $params['amount'],
                'invoice_number'  => $params['invoice_number'],
                'currency'        => 'IDR',
                'callback_url'    => route('checkout.result', $params['invoice_number']),
                'callback_url_cancel' => route('events.index'),
                'auto_redirect'   => true,
                'disable_retry_payment' => true,
                'language'        => 'ID',
            ],
            'payment' => [
                'payment_due_date' => $expiryMinutes,
            ],
            'customer' => [
                'id'    => $params['customer_id'] ?? $params['invoice_number'],
                'name'  => $params['customer_name'],
                'email' => $params['customer_email'],
            ],
        ];

        $jsonBody = json_encode($body);

        $signature = $this->generateSignature($requestId, $requestTimestamp, $requestTarget, $jsonBody);

        try {
            $response = Http::withHeaders([
                'Client-Id'          => $this->clientId,
                'Request-Id'         => $requestId,
                'Request-Timestamp'  => $requestTimestamp,
                'Signature'          => $signature,
                'Content-Type'       => 'application/json',
            ])->post($this->baseUrl . $requestTarget, $body);

            if ($response->successful()) {
                $data = $response->json();
                Log::info('DOKU VA created', ['response' => $data]);
                return $data;
            }

            Log::error('DOKU VA creation failed', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('DOKU API Exception', ['message' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Verify DOKU notification signature.
     */
    public function verifyNotification(array $headers, string $rawBody): bool
    {
        $clientId          = $headers['client-id'] ?? ($headers['Client-Id'] ?? '');
        $requestId         = $headers['request-id'] ?? ($headers['Request-Id'] ?? '');
        $requestTimestamp   = $headers['request-timestamp'] ?? ($headers['Request-Timestamp'] ?? '');
        $notificationSignature = $headers['signature'] ?? ($headers['Signature'] ?? '');
        $requestTarget     = '/doku/notification'; // the webhook path

        $digest = base64_encode(hash('sha256', $rawBody, true));
        $componentSignature = "Client-Id:{$clientId}\nRequest-Id:{$requestId}\nRequest-Timestamp:{$requestTimestamp}\nRequest-Target:{$requestTarget}\nDigest:{$digest}";

        $expectedSignature = 'HMACSHA256=' . base64_encode(hash_hmac('sha256', $componentSignature, $this->secretKey, true));

        return hash_equals($expectedSignature, $notificationSignature);
    }
}
