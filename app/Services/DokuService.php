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

        $this->clientId = config('doku.client_id');
        $this->secretKey = config('doku.secret_key');
        $this->baseUrl = rtrim(config('doku.base_url'), '/');
    }

    protected function generateSignature(string $requestId, string $requestTimestamp, string $requestTarget, string $body = ''): string
    {
        $componentSignature = "Client-Id:{$this->clientId}\nRequest-Id:{$requestId}\nRequest-Timestamp:{$requestTimestamp}\nRequest-Target:{$requestTarget}";
        
        if ($body !== '') {
            $digest = base64_encode(hash('sha256', $body, true));
            $componentSignature .= "\nDigest:{$digest}";
        }

        $signature = base64_encode(hash_hmac('sha256', $componentSignature, $this->secretKey, true));

        return "HMACSHA256={$signature}";
    }

    /**
     * Create a Virtual Account payment order via DOKU.
     *
     * @param  array  $params  [
     *                         'invoice_number' => string,
     *                         'amount'         => int,
     *                         'customer_name'  => string,
     *                         'customer_email' => string,
     *                         'item_name'      => string,
     *                         'channel'        => string (e.g. 'MANDIRI', 'BCA', 'BNI', 'BRI', 'PERMATA', 'CIMB')
     *                         ]
     */
    public function createVirtualAccount(array $params): ?array
    {
        $requestId = Str::uuid()->toString();
        $requestTimestamp = gmdate("Y-m-d\TH:i:s\Z");
        $requestTarget = '/checkout/v1/payment';

        $expiryMinutes = config('doku.expiry_minutes', 60);

        // Use current request URL for callback if we are in local to ensure browser can redirect back
        $appUrl = app()->environment('local') ? request()->root() : rtrim(config('app.url', 'https://dosinyam.com'), '/');
        
        $body = [
            'order' => [
                'amount' => $params['amount'],
                'invoice_number' => $params['invoice_number'],
                'callback_url' => $appUrl.'/checkout/'.$params['invoice_number'].'/result',
                'auto_redirect' => true,
            ],
            'payment' => [
                'payment_due_date' => (int) $expiryMinutes,
            ],
            'customer' => [
                'id' => $params['customer_id'] ?? $params['invoice_number'],
                'name' => $params['customer_name'],
                'email' => $params['customer_email'],
            ],
        ];

        $jsonBody = json_encode($body);

        Log::info('DOKU Request Payload', [
            'url' => $this->baseUrl.$requestTarget,
            'client_id' => $this->clientId,
            'body' => $body,
        ]);

        $signature = $this->generateSignature($requestId, $requestTimestamp, $requestTarget, $jsonBody);

        try {
            $response = Http::withHeaders([
                'Client-Id' => $this->clientId,
                'Request-Id' => $requestId,

                'Request-Timestamp' => $requestTimestamp,
                'Signature' => $signature,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl.$requestTarget, $body);

            Log::info('DOKU Raw Response', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            if ($response->successful()) {
                $data = $response->json();
                Log::info('DOKU VA created successfully', ['response' => $data]);

                return $data;
            }

            Log::error('DOKU VA creation failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('DOKU API Exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return null;
        }
    }

    /**
     * Verify DOKU notification signature.
     */
    public function verifyNotification(array $headers, string $rawBody): bool
    {
        $clientId = $headers['client-id'] ?? ($headers['Client-Id'] ?? '');
        $requestId = $headers['request-id'] ?? ($headers['Request-Id'] ?? '');
        $requestTimestamp = $headers['request-timestamp'] ?? ($headers['Request-Timestamp'] ?? '');
        $notificationSignature = $headers['signature'] ?? ($headers['Signature'] ?? '');
        $requestTarget = '/doku/notification'; // the webhook path

        $digest = base64_encode(hash('sha256', $rawBody, true));
        $componentSignature = "Client-Id:{$clientId}\nRequest-Id:{$requestId}\nRequest-Timestamp:{$requestTimestamp}\nRequest-Target:{$requestTarget}\nDigest:{$digest}";

        $expectedSignature = 'HMACSHA256='.base64_encode(hash_hmac('sha256', $componentSignature, $this->secretKey, true));

        return hash_equals($expectedSignature, $notificationSignature);
    }

    /**
     * Check the status of a payment via DOKU.
     */
    public function checkPaymentStatus(string $invoiceNumber): ?array
    {
        $requestId = Str::uuid()->toString();
        $requestTimestamp = gmdate("Y-m-d\TH:i:s\Z");
        $requestTarget = "/orders/v1/status/{$invoiceNumber}";

        $signature = $this->generateSignature($requestId, $requestTimestamp, $requestTarget, '');

        try {
            $response = Http::withHeaders([
                'Client-Id' => $this->clientId,
                'Request-Id' => $requestId,
                'Request-Timestamp' => $requestTimestamp,
                'Signature' => $signature,
            ])->get($this->baseUrl.$requestTarget);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('DOKU Status Check failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('DOKU Status Check Exception', ['message' => $e->getMessage()]);

            return null;
        }
    }
}
