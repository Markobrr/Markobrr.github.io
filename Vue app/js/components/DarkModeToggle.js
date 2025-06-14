// Dark Mode Toggle Component
const DarkModeToggle = {
    template: `
        <button 
            class="dark-mode-toggle"
            @click="toggleDarkMode"
            :title="isDarkMode ? 'Prebaci na svijetli način rada' : 'Prebaci na tamni način rada'"
        >
            <div class="toggle-icon-container">
                <i 
                    class="toggle-icon sun-icon fas fa-sun"
                    :class="{ active: !isDarkMode }"
                ></i>
                <i 
                    class="toggle-icon moon-icon fas fa-moon"
                    :class="{ active: isDarkMode }"
                ></i>
            </div>
            <span class="toggle-text">
                {{ isDarkMode ? 'Svijetli' : 'Tamni' }}
            </span>
        </button>
    `,

    setup() {
        const { ref, onMounted, watch } = Vue;

        // Reactive state
        const isDarkMode = ref(false);

        // Methods
        const toggleDarkMode = () => {
            isDarkMode.value = !isDarkMode.value;
            applyTheme();
            saveThemePreference();
            
            // Show toast notification
            if (window.toast) {
                window.toast.success(
                    `Prebačeno na ${isDarkMode.value ? 'tamni' : 'svijetli'} način rada`,
                    'Tema'
                );
            }
        };

        const applyTheme = () => {
            const root = document.documentElement;
            
            if (isDarkMode.value) {
                root.classList.add('dark-mode');
                root.classList.remove('light-mode');
            } else {
                root.classList.add('light-mode');
                root.classList.remove('dark-mode');
            }
        };

        const saveThemePreference = () => {
            localStorage.setItem('theme-preference', isDarkMode.value ? 'dark' : 'light');
        };

        const loadThemePreference = () => {
            const saved = localStorage.getItem('theme-preference');
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            if (saved) {
                isDarkMode.value = saved === 'dark';
            } else {
                isDarkMode.value = systemPrefersDark;
            }
            
            applyTheme();
        };

        const handleSystemThemeChange = (e) => {
            // Only apply system theme if user hasn't set a preference
            const saved = localStorage.getItem('theme-preference');
            if (!saved) {
                isDarkMode.value = e.matches;
                applyTheme();
            }
        };

        // Watch for theme changes
        watch(isDarkMode, () => {
            applyTheme();
        });

        // Lifecycle
        onMounted(() => {
            loadThemePreference();
            
            // Listen for system theme changes
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', handleSystemThemeChange);
            
            // Cleanup listener when component unmounts
            return () => {
                mediaQuery.removeEventListener('change', handleSystemThemeChange);
            };
        });

        return {
            isDarkMode,
            toggleDarkMode
        };
    }
};
