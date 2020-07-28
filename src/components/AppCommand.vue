<template>
  <div
    class="app-command"
    v-hotkey="keymap"
  >
    <input
      ref="input"
      type="text"
      class="app-command-input"
      placeholder="Your wish..."
      v-model="query"
    />
    <ul class="app-command-results no-style">
      <li
        v-for="(option, index) in result"
        :key="index"
      >
        <button
          type="button"
          @mouseover="setActiveOptionToIndex(index)"
          @click="checkActiveOption"
          :class="{ 'no-style': true, 'is-active': isOptionActive(index) }"
        >
          {{ getOptionTitle(option) }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import Fuse from "fuse.js";
import { documentGetTitle } from "./../utils/document";

const fuseOptions = {
  includeScore: true,
  keys: ["name"],
};

export default {
  name: "AppCommand",

  data() {
    return {
      activeItem: 0,
      actions: [
        {
          name: "+ New file",
          command: "NEW_FILE",
        },
        {
          name: "Delete current file",
          command: "DELETE_FILE",
        },
      ],
      fuse: new Fuse(this.options, fuseOptions),
      query: "",
    };
  },

  computed: {
    documents() {
      return this.$store.getters.allDocuments;
    },

    options() {
      return this.actions.concat(this.documents);
    },

    result() {
      if (this.query === "") {
        return this.options.slice(0, 5);
      }
      console.log("options", this.options);
      this.fuse.setCollection(this.options);
      const result = this.fuse.search(this.query);

      return result.length > 0
        ? result.slice(0, 5)
        : [{ name: "No results", command: null }];
    },

    keymap() {
      return {
        enter: () => {
          this.checkActiveOption();
        },
        down: () => {
          this.setActiveItem(1);
        },
        up: () => {
          this.setActiveItem(-1);
        },
        esc: () => {
          this.closeMe();
        },
      };
    },
  },

  methods: {
    closeMe() {
      this.$emit("close");
    },

    getOptionTitle(option) {
      if (option.item) {
        return option.item.name !== undefined
          ? option.item.name
          : documentGetTitle(option);
      } else {
        return option.name !== undefined
          ? option.name
          : documentGetTitle(option);
      }
    },

    checkActiveOption() {
      const option = this.result[this.activeItem].item
        ? this.result[this.activeItem].item
        : this.result[this.activeItem];
      if (option === undefined) {
        return false;
      }

      option.command = option.id !== undefined ? "OPEN" : option.command;
      if (option.command !== undefined) {
        this.doCommand(option.command, {
          documentId: option.id,
        });
      }
    },

    doCommand(command, options) {
      switch (command) {
        case "NEW_FILE":
          this.$store.dispatch("newDocument").then((doc) => {
            this.$router.push({
              name: "Document",
              params: { documentId: doc.id },
            });
          });
          break;
        case "OPEN":
          this.$router.push({
            name: "Document",
            params: { documentId: options.documentId },
          });
          break;
        default:
          break;
      }
      this.closeMe();
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
    },
  },

  mounted() {
    this.$refs.input.focus();
  },
};
</script>
