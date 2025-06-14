// Color Variants Component
const ColorVariants = {
    props: {
        colors: {
            type: Array,
            default: () => []
        },
        selectedColor: {
            type: String,
            default: ''
        },
        size: {
            type: String,
            default: 'normal', // 'small', 'normal', 'large'
            validator: (value) => ['small', 'normal', 'large'].includes(value)
        },
        showLabels: {
            type: Boolean,
            default: false
        }
    },

    emits: ['color-selected'],

    template: `
        <div class="color-variants" :class="sizeClass" v-if="colors.length > 0">
            <div class="color-variants-label" v-if="showLabels">
                <span>Boja:</span>
                <span class="selected-color-name">{{ selectedColorName }}</span>
            </div>
            
            <div class="color-options">
                <button
                    v-for="color in colors"
                    :key="color.code"
                    class="color-option"
                    :class="{ 
                        active: selectedColor === color.code,
                        'has-pattern': color.pattern 
                    }"
                    :style="getColorStyle(color)"
                    :title="color.name"
                    @click="selectColor(color)"
                >
                    <!-- Pattern overlay for special colors -->
                    <div 
                        v-if="color.pattern" 
                        class="color-pattern"
                        :style="{ backgroundImage: \`url(\${color.pattern})\` }"
                    ></div>
                    
                    <!-- Checkmark for selected color -->
                    <i 
                        class="fas fa-check color-check"
                        v-if="selectedColor === color.code"
                    ></i>
                    
                    <!-- Color name tooltip -->
                    <div class="color-tooltip">{{ color.name }}</div>
                </button>
            </div>
        </div>
    `,

    setup(props, { emit }) {
        const { computed } = Vue;

        // Computed properties
        const sizeClass = computed(() => {
            return `color-variants-${props.size}`;
        });

        const selectedColorName = computed(() => {
            const color = props.colors.find(c => c.code === props.selectedColor);
            return color ? color.name : 'Odaberite boju';
        });

        // Methods
        const selectColor = (color) => {
            emit('color-selected', color);
            
            // Show toast notification
            if (window.toast) {
                window.toast.success(
                    `Odabrana boja: ${color.name}`,
                    'Boja proizvoda'
                );
            }
            
            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(30);
            }
        };

        const getColorStyle = (color) => {
            const style = {};
            
            if (color.gradient) {
                style.background = color.gradient;
            } else if (color.code) {
                style.backgroundColor = color.code;
            }
            
            // Add border for light colors
            if (isLightColor(color.code)) {
                style.border = '2px solid var(--border-color)';
            }
            
            return style;
        };

        const isLightColor = (hexColor) => {
            if (!hexColor) return false;
            
            // Convert hex to RGB
            const hex = hexColor.replace('#', '');
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            
            // Calculate brightness
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return brightness > 200;
        };

        return {
            sizeClass,
            selectedColorName,
            selectColor,
            getColorStyle
        };
    }
};
