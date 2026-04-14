import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { configureEcho } from '@laravel/echo-react';
import { NotificationProvider } from './Contexts/NotificationContext';
import FlashMessageListener from './Components/FlashMessageListener';

configureEcho({
    broadcaster: 'reverb',
});

const appName = import.meta.env.VITE_APP_NAME || 'EventHive';

createInertiaApp({
    title: (title) => title ? `${title} — EventHive` : 'EventHive',
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        if (import.meta.env.SSR) {
            hydrateRoot(el, <NotificationProvider><App {...props} /></NotificationProvider>);
            return;
        }

        createRoot(el).render(
            <NotificationProvider>
                <FlashMessageListener />
                <App {...props} />
            </NotificationProvider>
        );
    },
    progress: {
        color: '#7C3AED',
    },
});
