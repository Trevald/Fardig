<template>
  <div class="app-command">
    <input
      ref="input"
      type="text"
      class="app-command-input"
      placeholder="Your wish..."
      v-hotkey="keymap"
    >
    <ul class="app-command-results no-style">
      <li
        v-for="(option, index) in options"
        :key="index"
      >
        <button
          type="button"
          @mouseover="setActiveOptionToIndex(index)"
          @click="doActiveOption"
          :class="{'no-style': true, 'is-active': isOptionActive(index)}"
        >{{getOptionTitle(option)}}</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { documentGetTitle } from "./../utils/document";

export default {
  name: "AppCommand",

  data() {
    return {
      activeItem: 0,
      actions: [
        {
          name: "+ New file",
          command: "NEW_FILE"
        }
      ]
    };
  },

  computed: {
    documents() {
      return this.$store.getters.allDocuments;
    },

    options() {
      return this.actions.concat(this.documents);
    },

    keymap() {
      return {
        enter: () => {
          this.doActiveOption();
        },
        down: () => {
          this.setActiveItem(1);
        },
        up: () => {
          this.setActiveItem(-1);
        },
        esc: () => {
          this.closeMe();
        }
      };
    }
  },

  methods: {
    closeMe() {
      this.$emit("command", { command: "CLOSE_ME" });
    },

    doMe() {},

    getOptionTitle(option) {
      return option.name !== undefined ? option.name : documentGetTitle(option);
    },

    doActiveOption() {
      const option = this.options[this.activeItem];
      if (option === undefined) {
        return false;
      }

      if (option.command !== undefined) {
        this.$emit("command", { command: option.command });
      } else if (option.id !== undefined) {
        this.$emit("command", {
          command: "OPEN",
          id: option.id
        });
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
      if (this.activeItem < 0) {
        this.activeItem = 0;
      }
      if (this.activeItem >= this.options.length) {
        this.activeItem = this.options.length - 1;
      }
    }
  },

  mounted() {
    this.$refs.input.focus();
  }
};
</script>
