// useNotifications Composable
function useNotifications() {
    const { computed } = Vue;
    const notificationStore = useNotificationStore();

    // Computed properties
    const notifications = computed(() => notificationStore.allNotifications);
    const hasNotifications = computed(() => notificationStore.hasNotifications);
    const latestNotification = computed(() => {
        const all = notifications.value;
        return all.length > 0 ? all[all.length - 1] : null;
    });

    // Notification methods
    const addNotification = (notification) => {
        return notificationStore.addNotification(notification);
    };

    const removeNotification = (id) => {
        notificationStore.removeNotification(id);
    };

    const clearAllNotifications = () => {
        notificationStore.clearAllNotifications();
    };

    // Convenience methods for different types
    const success = (title, message, duration = 3000) => {
        return notificationStore.success(title, message, duration);
    };

    const error = (title, message, duration = 5000) => {
        return notificationStore.error(title, message, duration);
    };

    const warning = (title, message, duration = 4000) => {
        return notificationStore.warning(title, message, duration);
    };

    const info = (title, message, duration = 3000) => {
        return notificationStore.info(title, message, duration);
    };

    // Advanced notification methods
    const showCartNotification = (product, action = 'added') => {
        const messages = {
            added: {
                title: 'Dodano u košaricu',
                message: `${product.title} je dodan u košaricu`,
                type: 'success'
            },
            removed: {
                title: 'Uklonjeno iz košarice',
                message: `${product.title} je uklonjen iz košarice`,
                type: 'info'
            },
            updated: {
                title: 'Košarica ažurirana',
                message: `Količina za ${product.title} je ažurirana`,
                type: 'info'
            }
        };

        const notification = messages[action] || messages.added;
        return addNotification({
            type: notification.type,
            title: notification.title,
            message: notification.message,
            duration: 3000
        });
    };

    const showOrderNotification = (status, orderNumber = null) => {
        const messages = {
            success: {
                title: 'Narudžba uspješna!',
                message: orderNumber 
                    ? `Vaša narudžba #${orderNumber} je uspješno poslana`
                    : 'Vaša narudžba je uspješno poslana',
                type: 'success',
                duration: 5000
            },
            processing: {
                title: 'Obrađuje se narudžba',
                message: 'Vaša narudžba se trenutno obrađuje...',
                type: 'info',
                duration: 3000
            },
            error: {
                title: 'Greška pri narudžbi',
                message: 'Došlo je do greške. Molimo pokušajte ponovo.',
                type: 'error',
                duration: 5000
            }
        };

        const notification = messages[status] || messages.error;
        return addNotification(notification);
    };

    const showNetworkNotification = (isOnline) => {
        if (isOnline) {
            return success(
                'Veza uspostavljena',
                'Internetska veza je ponovno uspostavljena',
                2000
            );
        } else {
            return error(
                'Nema internetske veze',
                'Provjerite internetsku vezu',
                0 // Persistent until connection is restored
            );
        }
    };

    const showFormNotification = (type, field = null) => {
        const messages = {
            validation: {
                title: 'Greška u formi',
                message: field 
                    ? `Molimo ispravite polje: ${field}`
                    : 'Molimo ispravite greške u formi',
                type: 'warning'
            },
            saved: {
                title: 'Spremljeno',
                message: 'Podaci su uspješno spremljeni',
                type: 'success'
            },
            error: {
                title: 'Greška pri spremanju',
                message: 'Došlo je do greške. Molimo pokušajte ponovo.',
                type: 'error'
            }
        };

        const notification = messages[type] || messages.error;
        return addNotification(notification);
    };

    // Notification with action button
    const showActionNotification = (title, message, actionText, actionCallback, duration = 5000) => {
        const id = addNotification({
            type: 'info',
            title,
            message: `${message} <button class="btn btn-sm btn-primary ml-2" onclick="(${actionCallback.toString()})()">${actionText}</button>`,
            duration,
            persistent: duration === 0
        });

        return id;
    };

    // Undo notification
    const showUndoNotification = (message, undoCallback, duration = 5000) => {
        return showActionNotification(
            'Akcija izvršena',
            message,
            'Poništi',
            undoCallback,
            duration
        );
    };

    // Progress notification
    const showProgressNotification = (title, initialMessage) => {
        const id = addNotification({
            type: 'info',
            title,
            message: initialMessage,
            duration: 0, // Persistent
            persistent: true
        });

        return {
            id,
            update: (message, progress = null) => {
                const notification = notifications.value.find(n => n.id === id);
                if (notification) {
                    notification.message = progress !== null 
                        ? `${message} (${progress}%)`
                        : message;
                }
            },
            complete: (successMessage = 'Završeno!') => {
                removeNotification(id);
                success('Završeno', successMessage, 2000);
            },
            error: (errorMessage = 'Došlo je do greške') => {
                removeNotification(id);
                error('Greška', errorMessage, 3000);
            }
        };
    };

    // Batch notifications
    const showBatchNotification = (items, action) => {
        const count = items.length;
        const itemType = count === 1 ? 'proizvod' : count < 5 ? 'proizvoda' : 'proizvoda';
        
        const messages = {
            added: {
                title: 'Dodano u košaricu',
                message: `${count} ${itemType} dodano u košaricu`,
                type: 'success'
            },
            removed: {
                title: 'Uklonjeno iz košarice',
                message: `${count} ${itemType} uklonjeno iz košarice`,
                type: 'info'
            }
        };

        const notification = messages[action] || messages.added;
        return addNotification(notification);
    };

    // Get notification icon based on type
    const getNotificationIcon = (type) => {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    };

    // Get notification color based on type
    const getNotificationColor = (type) => {
        const colors = {
            success: 'var(--success-color)',
            error: 'var(--error-color)',
            warning: 'var(--warning-color)',
            info: 'var(--primary-color)'
        };
        return colors[type] || colors.info;
    };

    // Format notification time
    const formatNotificationTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) { // Less than 1 minute
            return 'Upravo sada';
        } else if (diff < 3600000) { // Less than 1 hour
            const minutes = Math.floor(diff / 60000);
            return `Prije ${minutes} min`;
        } else if (diff < 86400000) { // Less than 1 day
            const hours = Math.floor(diff / 3600000);
            return `Prije ${hours} h`;
        } else {
            return date.toLocaleDateString('hr-HR');
        }
    };

    // Auto-clear old notifications
    const autoCleanup = (maxAge = 24 * 60 * 60 * 1000) => { // 24 hours
        const now = new Date();
        notifications.value.forEach(notification => {
            const age = now - new Date(notification.createdAt);
            if (age > maxAge && !notification.persistent) {
                removeNotification(notification.id);
            }
        });
    };

    // Return all methods and computed properties
    return {
        // Computed
        notifications,
        hasNotifications,
        latestNotification,

        // Basic methods
        addNotification,
        removeNotification,
        clearAllNotifications,

        // Convenience methods
        success,
        error,
        warning,
        info,

        // Specialized methods
        showCartNotification,
        showOrderNotification,
        showNetworkNotification,
        showFormNotification,
        showActionNotification,
        showUndoNotification,
        showProgressNotification,
        showBatchNotification,

        // Utility methods
        getNotificationIcon,
        getNotificationColor,
        formatNotificationTime,
        autoCleanup
    };
}
