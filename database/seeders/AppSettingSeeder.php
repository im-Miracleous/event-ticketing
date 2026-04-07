<?php

namespace Database\Seeders;

use App\Models\AppSetting;
use Illuminate\Database\Seeder;

class AppSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'key'         => 'app_name',
                'value'       => 'EventHive',
                'type'        => 'text',
                'label'       => 'Application Name',
                'description' => 'The public-facing name of the application shown in the browser tab, emails, and header.',
            ],
            [
                'key'         => 'app_tagline',
                'value'       => 'Your Premier Event Ticketing Platform',
                'type'        => 'text',
                'label'       => 'App Tagline',
                'description' => 'A short slogan displayed on the landing page.',
            ],
            [
                'key'         => 'app_logo',
                'value'       => null,
                'type'        => 'image',
                'label'       => 'Application Logo',
                'description' => 'Path to the logo image file. Upload via the admin panel.',
            ],
            [
                'key'         => 'app_favicon',
                'value'       => null,
                'type'        => 'image',
                'label'       => 'Favicon',
                'description' => 'Path to the favicon (.ico or .png) displayed in browser tabs.',
            ],
            [
                'key'         => 'app_primary_color',
                'value'       => '#6366f1',
                'type'        => 'text',
                'label'       => 'Primary Brand Color',
                'description' => 'The main accent color used throughout the UI (hex code).',
            ],
            [
                'key'         => 'contact_email',
                'value'       => 'support@eventhive.com',
                'type'        => 'text',
                'label'       => 'Support Email',
                'description' => 'Public contact email shown on the contact page and in emails.',
            ],
            [
                'key'         => 'contact_phone',
                'value'       => null,
                'type'        => 'text',
                'label'       => 'Support Phone Number',
                'description' => 'Public phone number shown on the contact page.',
            ],
            [
                'key'         => 'maintenance_mode',
                'value'       => '0',
                'type'        => 'boolean',
                'label'       => 'Maintenance Mode',
                'description' => 'When enabled (1), the site displays a maintenance page to non-admin users.',
            ],
            [
                'key'         => 'allow_registration',
                'value'       => '1',
                'type'        => 'boolean',
                'label'       => 'Allow Public Registration',
                'description' => 'When disabled (0), new users cannot register through the public form.',
            ],
            [
                'key'         => 'currency',
                'value'       => 'IDR',
                'type'        => 'text',
                'label'       => 'Currency Code',
                'description' => 'ISO 4217 currency code used for ticket pricing (e.g. IDR, USD).',
            ],
            [
                'key'         => 'platform_fee',
                'value'       => '20',
                'type'        => 'text',
                'label'       => 'Platform Fee (%)',
                'description' => 'Percentage deducted from each transaction as platform revenue.',
            ],
            [
                'key'         => 'social_facebook',
                'value'       => 'https://facebook.com/eventhive',
                'type'        => 'text',
                'label'       => 'Facebook Link',
                'description' => 'Official Facebook page URL.',
            ],
            [
                'key'         => 'social_instagram',
                'value'       => 'https://instagram.com/eventhive',
                'type'        => 'text',
                'label'       => 'Instagram Link',
                'description' => 'Official Instagram profile URL.',
            ],
            [
                'key'         => 'social_twitter',
                'value'       => 'https://x.com/eventhive',
                'type'        => 'text',
                'label'       => 'X (Twitter) Link',
                'description' => 'Official X/Twitter profile URL.',
            ],
            [
                'key'         => 'payment_gateway',
                'value'       => 'Midtrans',
                'type'        => 'text',
                'label'       => 'Payment Gateway Provider',
                'description' => 'The payment gateway used for processing transactions.',
            ],
            [
                'key'         => 'payment_mode',
                'value'       => 'Sandbox',
                'type'        => 'text',
                'label'       => 'Payment Mode',
                'description' => 'Sandbox for testing, Production for live payments.',
            ],
            [
                'key'         => 'payment_api_key',
                'value'       => 'SB-Mid-server-xxxxxxxxxxxx',
                'type'        => 'text',
                'label'       => 'Payment API Key',
                'description' => 'API key for the payment gateway. Keep this secret.',
            ],
        ];

        foreach ($settings as $setting) {
            AppSetting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
