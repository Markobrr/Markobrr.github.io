// Price Range Slider Component
const PriceRangeSlider = {
    props: {
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 5000
        },
        step: {
            type: Number,
            default: 50
        },
        modelValue: {
            type: Array,
            default: () => [0, 5000]
        }
    },

    emits: ['update:modelValue', 'change'],

    template: `
        <div class="price-range-slider">
            <div class="price-range-header">
                <label class="price-range-label">Raspon cijena</label>
                <div class="price-range-values">
                    {{ formatPrice(localValue[0]) }} - {{ formatPrice(localValue[1]) }}
                </div>
            </div>
            
            <div class="price-range-container" ref="sliderContainer">
                <div class="price-range-track">
                    <div 
                        class="price-range-fill" 
                        :style="fillStyle"
                    ></div>
                </div>
                
                <input
                    type="range"
                    :min="min"
                    :max="max"
                    :step="step"
                    v-model.number="localValue[0]"
                    @input="updateRange"
                    class="price-range-input price-range-input-min"
                >
                
                <input
                    type="range"
                    :min="min"
                    :max="max"
                    :step="step"
                    v-model.number="localValue[1]"
                    @input="updateRange"
                    class="price-range-input price-range-input-max"
                >
            </div>
            
            <div class="price-range-inputs">
                <div class="price-input-group">
                    <label>Min</label>
                    <input
                        type="number"
                        :min="min"
                        :max="localValue[1]"
                        :step="step"
                        v-model.number="localValue[0]"
                        @input="updateRange"
                        class="price-input"
                    >
                </div>
                <div class="price-input-separator">-</div>
                <div class="price-input-group">
                    <label>Max</label>
                    <input
                        type="number"
                        :min="localValue[0]"
                        :max="max"
                        :step="step"
                        v-model.number="localValue[1]"
                        @input="updateRange"
                        class="price-input"
                    >
                </div>
            </div>
        </div>
    `,

    setup(props, { emit }) {
        const { ref, computed, watch } = Vue;
        
        const localValue = ref([...props.modelValue]);
        
        // Computed properties
        const fillStyle = computed(() => {
            const range = props.max - props.min;
            const leftPercent = ((localValue.value[0] - props.min) / range) * 100;
            const rightPercent = ((localValue.value[1] - props.min) / range) * 100;
            
            return {
                left: `${leftPercent}%`,
                width: `${rightPercent - leftPercent}%`
            };
        });

        // Methods
        const formatPrice = (price) => {
            return new Intl.NumberFormat('hr-HR', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(price);
        };

        const updateRange = () => {
            // Ensure min is not greater than max
            if (localValue.value[0] > localValue.value[1]) {
                localValue.value[0] = localValue.value[1];
            }
            
            emit('update:modelValue', [...localValue.value]);
            emit('change', [...localValue.value]);
        };

        // Watch for external changes
        watch(() => props.modelValue, (newValue) => {
            localValue.value = [...newValue];
        }, { deep: true });

        return {
            localValue,
            fillStyle,
            formatPrice,
            updateRange
        };
    }
};
