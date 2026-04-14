import { useEffect } from 'react';
import { router } from '@inertiajs/react';
import { useNotification, NotificationType } from '@/Contexts/NotificationContext';

export default function FlashMessageListener() {
    const { showNotification } = useNotification();

    useEffect(() => {
        const removeListener = router.on('success', (event) => {
            const props = event.detail.page.props as any;
            if (props.flash) {
                if (props.flash.success) {
                    showNotification('success', props.flash.success);
                }
                if (props.flash.error) {
                    showNotification('error', props.flash.error);
                }
                if (props.flash.info) {
                    showNotification('info', props.flash.info);
                }
                if (props.flash.warning) {
                    showNotification('warning', props.flash.warning);
                }
            }
        });

        return () => removeListener();
    }, [showNotification]);

    return null;
}
