// Toast Notifications Component
const ToastNotifications = {
    template: `
        <div class="toast-container">
            <transition-group name="toast" tag="div">
                <div 
                    v-for="toast in toasts" 
                    :key="toast.id"
                    :class="['toast', 'toast-' + toast.type]"
                    @click="removeToast(toast.id)"
                >
                    <div class="toast-icon">
                        <i :class="getToastIcon(toast.type)"></i>
                    </div>
                    <div class="toast-content">
                        <div class="toast-title" v-if="toast.title">{{ toast.title }}</div>
                        <div class="toast-message">{{ toast.message }}</div>
                    </div>
                    <button class="toast-close" @click.stop="removeToast(toast.id)">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </transition-group>
        </div>
    `,

    setup() {
        const { ref, onMounted } = Vue;
        
        const toasts = ref([]);
        let toastId = 0;

        // Methods
        const addToast = (type, message, title = null, duration = 4000) => {
            const id = ++toastId;
            const toast = {
                id,
                type,
                message,
                title,
                duration
            };

            toasts.value.push(toast);

            // Auto remove after duration
            if (duration > 0) {
                setTimeout(() => {
                    removeToast(id);
                }, duration);
            }

            return id;
        };

        const removeToast = (id) => {
            const index = toasts.value.findIndex(toast => toast.id === id);
            if (index > -1) {
                toasts.value.splice(index, 1);
            }
        };

        const getToastIcon = (type) => {
            const icons = {
                success: 'fas fa-check-circle',
                error: 'fas fa-exclamation-circle',
                warning: 'fas fa-exclamation-triangle',
                info: 'fas fa-info-circle'
            };
            return icons[type] || icons.info;
        };

        const success = (message, title = null) => addToast('success', message, title);
        const error = (message, title = null) => addToast('error', message, title);
        const warning = (message, title = null) => addToast('warning', message, title);
        const info = (message, title = null) => addToast('info', message, title);

        // Global toast functions
        onMounted(() => {
            window.toast = {
                success,
                error,
                warning,
                info,
                addToast,
                removeToast
            };
        });

        return {
            toasts,
            removeToast,
            getToastIcon
        };
    }
};
