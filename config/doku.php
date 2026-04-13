<?php

return [

    /*
    |--------------------------------------------------------------------------
    | DOKU Payment Gateway Configuration
    |--------------------------------------------------------------------------
    |
    | Configure your DOKU credentials here. You can get these from:
    | https://dashboard.doku.com (Production)
    | https://dashboard-sandbox.doku.com (Sandbox)
    |
    */

    'client_id'  => env('DOKU_CLIENT_ID', ''),
    'secret_key' => env('DOKU_SECRET_KEY', ''),

    /*
    | Base URL for DOKU API.
    |  - Sandbox:    https://api-sandbox.doku.com
    |  - Production: https://api.doku.com
    */
    'base_url' => env('DOKU_BASE_URL', 'https://api-sandbox.doku.com'),

    /*
    | The public-facing URL that DOKU will POST notifications to.
    | Must be publicly accessible (use ngrok for local dev).
    */
    'notification_url' => env('DOKU_NOTIFICATION_URL', ''),

    /*
    | Expiry duration for Virtual Account payments (in minutes).
    */
    'expiry_minutes' => (int) env('DOKU_EXPIRY_MINUTES', 60),

];
