<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DokuService
{
    protected string $clientId;
    protected string $secretKey;
    protected string $baseUrl;

    public function __construct()
    {
        $this->clientId = config('services.doku.client_id');
        $this->secretKey = config('services.doku.secret_key');
        $this->baseUrl = config('services.doku.base_url', 'https://api-sandbox.doku.com');
    }

    public function createPayment(array $params)
    {
        $requestId = uniqid();
        $timestamp = gmdate("Y-m-d\TH:i:s\Z");
        $targetPath = '/checkout/v1/payment';
        
        $body = [
            'order' => [
                'amount' => $params['amount'],
                'invoice_number' => $params['invoice_number'],
                'callback_url' => $params['callback_url'] ?? route('checkout.result', ['transactionId' => $params['invoice_number']]),
            ],
            'payment' => [
                'payment_due_date' => 60, // 60 minutes
            ],
            'customer' => [
                'id' => $params['customer_id'] ?? 'CUST-001',
                'name' => $params['customer_name'] ?? 'Customer',
                'email' => $params['customer_email'] ?? 'customer@example.com',
            ],
        ];

        $jsonBody = json_encode($body);
        $digest = base64_encode(hash('sha256', $jsonBody, true));
        
        $signatureString = "Client-Id:" . $this->clientId . "\n" .
                           "Request-Id:" . $requestId . "\n" .
                           "Response-Timestamp:" . $timestamp . "\n" .
                           "Target-Path:" . $targetPath . "\n" .
                           "Digest:" . $digest;

        $signature = base64_encode(hash_hmac('sha256', $signatureString, $this->secretKey, true));

        try {
            $response = Http::withHeaders([
                'Client-Id' => $this->clientId,
                'Request-Id' => $requestId,
                'Request-Timestamp' => $timestamp,
                'Signature' => "HMACSHA256=" . $signature,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . $targetPath, $body);

            return $response->json();
        } catch (\Exception $e) {
            Log::error('DOKU Payment Error: ' . $e->getMessage());
            return null;
        }
    }
}
