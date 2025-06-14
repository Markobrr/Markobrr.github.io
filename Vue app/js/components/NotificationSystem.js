// NotificationSystem Component
const NotificationSystem = {
    template: `
        <div class="notification-system">
            <transition-group name="notification" tag="div" class="notifications-container">
                <div 
                    v-for="notification in notifications" 
                    :key="notification.id"
                    class="notification"
                    :class="'notification-' + notification.type"
                >
                    <div class="notification-icon">
                        <i :class="getNotificationIcon(notification.type)"></i>
                    </div>
                    <div class="notification-content">
                        <div class="notification-title" v-if="notification.title">
                            {{ notification.title }}
                        </div>
                        <div class="notification-message" v-html="notification.message"></div>
                    </div>
                    <button 
                        class="notification-close"
                        @click="removeNotification(notification.id)"
                        v-if="!notification.persistent"
                    >
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </transition-group>
        </div>
    `,

    setup() {
        const { computed } = Vue;
        const { notifications, removeNotification, getNotificationIcon } = useNotifications();

        return {
            // Computed
            notifications,

            // Methods
            removeNotification,
            getNotificationIcon
        };
    }
};
