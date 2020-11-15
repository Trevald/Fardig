<template>
    <transition name="transition-confirm" @enter="setFocus('primary')">
        <div
            class="vue-genie-confirm-overlay"
            v-if="isActive"
            @keydown="keydown"
        >
            <div class="modal">
                <p class="text">{{ text }}</p>
                <div class="footer">
                    <button type="cancel" ref="secondary" @click="cancel">
                        No
                    </button>
                    <button type="ok" ref="primary" class="primary" @click="ok">
                        Yes
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: "AppConfirm",

    computed: {
        isActive() {
            return this.$genieConfirm.isActive;
        },

        text() {
            return this.$genieConfirm.text;
        },
    },

    methods: {
        cancel() {
            this.$genieConfirm.answer(false);
        },
        ok() {
            this.$genieConfirm.answer(true);
        },

        keydown(event) {
            switch (event.keyCode) {
                case 9: // Tab
                    event.preventDefault();
                    this.switchFocus();
                    break;
                case 37: // Left arrow
                    event.preventDefault();
                    this.switchFocus(0);
                    break;
                case 39: // Right arrow
                    event.preventDefault();
                    this.switchFocus(1);
                    break;
                case 13: // Enter
                    break;
                case 27: // Esc
                    event.preventDefault();
                    this.cancel();
                    break;
                default:
                    event.preventDefault();
                    break;
            }
        },

        switchFocus(index) {
            let newActiveElement;
            if (index !== undefined) {
                newActiveElement = Object.keys(this.$refs)[index];
            } else {
                const activeElement = document.activeElement;
                newActiveElement =
                    this.$refs.primary === activeElement
                        ? "secondary"
                        : "primary";
            }
            this.setFocus(newActiveElement);
        },

        setFocus(buttonName) {
            this.$refs[buttonName].focus();
        },
    },
};
</script>

<style type="text/css">
.vue-genie-confirm-overlay {
    position: fixed;
    z-index: 100;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.1);
}

.vue-genie-confirm-overlay .modal {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: calc(var(--unit) * 2) calc(var(--unit) * 4);
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
    background: var(--color-command-background);

    color: var(--color-command-foreground);
    box-shadow: var(--shadow-overlay);
}

.vue-genie-confirm-overlay .text {
    margin-bottom: calc(var(--unit) * 2);
    font-family: var(--font-monospace);
    font-size: calc(var(--unit) * 2.25);
    line-height: calc(var(--unit) * 3);
    color: var(--color-fg-emphasized);
}

.vue-genie-confirm-overlay .footer {
    display: flex;
    justify-content: center;
    width: 100%;
}

.transition-confirm-enter,
.transition-confirm-leave-to {
    opacity: 0;
}

.transition-confirm-enter-active {
    transition: opacity 0.25s linear;
}

.transition-confirm-leave-active {
    transition: opacity 0.25s linear 0.25s;
}

.transition-confirm-enter-active .modal {
    transition: transform 0.25s ease-out;
}

.transition-confirm-leave-active .modal {
    transition: transform 0.25s ease-in;
}

.transition-confirm-enter .modal,
.transition-confirm-leave-to .modal {
    transform: translateY(-100%) translateX(-50%);
}
</style>
