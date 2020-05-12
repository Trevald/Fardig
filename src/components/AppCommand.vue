<template>
    <div class="app-command">
        <input ref="input" type="text" class="app-command-input" placeholder="Your wish..."  v-hotkey="keymap">
        <ul class="app-command-results no-list">
            <li v-for="(option, index) in options" :key="index">
                <button type="button" @mouseover="setActiveOptionToIndex(index)" @click="doActiveOption" :class="{'no-style': true, 'is-active': isOptionActive(index)}">{{option.name}}</button>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    
    name: "AppCommand",

    props: {
        documents: Array
    },

    data() {
        return {
            activeItem: 0,
            actions: [{
                name: "+ New file",
                command: "NEW_FILE"
            }]
        }
    },

    computed: {

        options() {
            return this.actions.concat(this.documents);
        },

        keymap() {
            return {
                "enter": () => {
                    this.doActiveOption();
                },
                "down": () => {
                    this.setActiveItem(1)
                },
                "up": () => {
                    this.setActiveItem(-1)
                },
                "esc": () => {
                    this.closeMe()
                }
            }
        }
    },

    methods: {

        closeMe() {
            this.$emit("command", {command: "CLOSE_ME"})
        },

        doMe() {

        },

        doActiveOption() {
            const option = this.options[this.activeItem];
            if (option.command !== undefined) {
                this.$emit("command", {command: option.command})
            } else {
                this.$emit("command", {
                    command: "OPEN",
                    id: option.id
                })
            }
        },

        isOptionActive(index) {
            return index === this.activeItem;
        },

        setActiveOptionToIndex(index) {
            this.activeItem = index;
        },

        setActiveItem(value) {
            this.activeItem = this.activeItem + value; 
            if (this.activeItem < 0 ) {
                this.activeItem = 0;
            }
            if (this.activeItem >= this.options.length) {
                this.activeItem = this.options.length -1;
            }
        }
    },

    mounted() {
        this.$refs.input.focus();
    }

}
</script>
