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
                'value'       => 'Event Ticketing',
                'type'        => 'text',
                'label'       => 'Application Name',
                'description' => 'The public-facing name of the application shown in the browser tab, emails, and header.',
            ],
            [
                'key'         => 'app_tagline',
                'value'       => 'Your gateway to unforgettable events.',
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
                'value'       => 'support@eventticketing.com',
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
        ];

        foreach ($settings as $setting) {
            AppSetting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
