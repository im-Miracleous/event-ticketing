<?php

namespace Tests\Unit;

use App\Services\DokuService;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class DokuSignatureTest extends TestCase
{
    /**
     * Test that the DOKU notification signature verification logic is correct.
     * This ensures that any changes to the signature generation math/formatting 
     * are caught immediately without needing a database.
     */
    public function test_doku_signature_verification_logic(): void
    {
        // 1. Setup mock DOKU credentials
        Config::set('doku.client_id', 'TEST-CLIENT-ID');
        Config::set('doku.secret_key', 'TEST-SECRET-KEY');
        Config::set('doku.base_url', 'https://api-sandbox.doku.com');

        $service = new DokuService();
        
        // 2. Sample data
        $body = json_encode([
            'order' => [
                'invoice_number' => 'TRX-12345',
                'amount' => 50000
            ],
            'transaction' => [
                'status' => 'SUCCESS'
            ]
        ]);

        // Manually calculate the expected signature for this specific payload
        // according to DOKU's SNAP specification logic implemented in DokuService.
        $requestId = 'REQ-550e8400-e29b-41d4-a716-446655440000';
        $timestamp = '2026-04-13T15:00:00Z';
        $targetPath = '/doku/notification';

        $digest = base64_encode(hash('sha256', $body, true));
        $componentSignature = "Client-Id:TEST-CLIENT-ID\n" .
                             "Request-Id:{$requestId}\n" .
                             "Request-Timestamp:{$timestamp}\n" .
                             "Request-Target:{$targetPath}\n" .
                             "Digest:{$digest}";
        
        $signatureValue = base64_encode(hash_hmac('sha256', $componentSignature, 'TEST-SECRET-KEY', true));
        $fullSignatureHeader = "HMACSHA256={$signatureValue}";

        $headers = [
            'Client-Id' => 'TEST-CLIENT-ID',
            'Request-Id' => $requestId,
            'Request-Timestamp' => $timestamp,
            'Signature' => $fullSignatureHeader
        ];

        // 3. Verify that the service correctly decodes and validates this signature
        $isValid = $service->verifyNotification($headers, $body);

        $this->assertTrue($isValid, "The signature verification failed. The logic in DokuService might have changed or formatting is incorrect.");
    }

    /**
     * Test that verification fails if the body is tampered with.
     */
    public function test_doku_signature_fails_if_payload_is_modified(): void
    {
        Config::set('doku.client_id', 'TEST-CLIENT-ID');
        Config::set('doku.secret_key', 'TEST-SECRET-KEY');

        $service = new DokuService();
        
        $originalBody = json_encode(['data' => 'secret']);
        $tamperedBody = json_encode(['data' => 'hacked']);

        $requestId = 'REQ-1';
        $timestamp = '2026-04-13T15:00:00Z';
        $targetPath = '/doku/notification';

        // Sign the ORIGINAL body
        $digest = base64_encode(hash('sha256', $originalBody, true));
        $componentSignature = "Client-Id:TEST-CLIENT-ID\nRequest-Id:{$requestId}\nRequest-Timestamp:{$timestamp}\nRequest-Target:{$targetPath}\nDigest:{$digest}";
        $signature = 'HMACSHA256=' . base64_encode(hash_hmac('sha256', $componentSignature, 'TEST-SECRET-KEY', true));

        $headers = [
            'Client-Id' => 'TEST-CLIENT-ID',
            'Request-Id' => $requestId,
            'Request-Timestamp' => $timestamp,
            'Signature' => $signature
        ];

        // Verify with the TAMPERED body - should be false
        $this->assertFalse($service->verifyNotification($headers, $tamperedBody));
    }
}
