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
        v-for="(option, index) in filteredActions"
        :key="index"
      >
        <button
          type="button"
          @mouseover="setActiveOptionToIndex('commands', index)"
          @click="checkActiveOption"
          :class="{ 'no-style': true, 'is-active': isOptionActive('commands', index) }"
        >
          <AppIcon
            :name="getOptionProp(option, 'icon')"
            :iconLightMode="getOptionProp(option, 'iconLightMode')"
          />
          {{ getOptionTitle(option) }}
        </button>
      </li>
    </ul>
    <h4 class="app-command-results-heading no-style">{{ resultsHeading }}</h4>
    <ul class="app-command-results no-style">

      <li
        v-for="(option, index) in filteredDocumentsSliced"
        :key="index"
      >
        <button
          type="button"
          @mouseover="setActiveOptionToIndex('documents', index)"
          @click="checkActiveOption"
          :class="{ 'no-style': true, 'is-active': isOptionActive('documents', index) }"
        >
          <AppIcon name="document" />
          {{ getOptionTitle(option) }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import Fuse from "fuse.js";
import { documentGetTitle } from "./../utils/document";
import AppIcon from "./AppIcon";

import { commands } from "./../commands/commands";

const fuseOptions = {
  includeScore: true,
  keys: ["name"],
};

export default {
  name: "AppCommand",

  components: {
    AppIcon,
  },

  data() {
    return {
      activeItem: 0,
      activeList: "commands",

      fuseActions: new Fuse(this.commands, fuseOptions),
      fuseDocuments: new Fuse(this.documents, fuseOptions),
      query: "",
      commands: [],
      unsubscribeActions: undefined,
    };
  },

  computed: {
    documents() {
      return this.$store.getters.allDocuments;
    },

    options() {
      return this.commands.concat(this.documents);
    },

    filteredActions() {
      if (this.query === "") {
        return this.commands.slice(0, 5);
      }
      this.fuseActions.setCollection(this.commands);
      return this.fuseActions.search(this.query).slice(0, 5);
    },

    filteredDocuments() {
      if (this.query === "") {
        return this.documents;
      }
      this.fuseDocuments.setCollection(this.documents);

      return this.fuseDocuments.search(this.query);
    },

    filteredDocumentsSliced() {
      return this.filteredDocuments.slice(0, 5);
    },

    resultsHeading() {
      const numberOfDocumentsFound = this.filteredDocuments.length;
      const numberOfDocumentsShown = this.filteredDocumentsSliced.length;

      return `${numberOfDocumentsShown} of ${numberOfDocumentsFound} documents`;
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
        return option.item.description !== undefined
          ? option.item.description
          : documentGetTitle(option);
      } else {
        return option.description !== undefined
          ? option.description
          : documentGetTitle(option);
      }
    },

    getOptionProp(option, propName) {
      return option.item ? option.item[propName] : option[propName];
    },

    checkActiveOption() {
      const result =
        this.activeList === "commands"
          ? this.filteredActions
          : this.filteredDocumentsSliced;
      const option = result[this.activeItem].item
        ? result[this.activeItem].item
        : result[this.activeItem];
      if (option === undefined) {
        return false;
      }

      if (option.id !== undefined && this.activeList === "commands") {
        console.log(1, option);
        this.$store.dispatch(option.action);
        this.$store.dispatch("toggleCommand");
      } else if (option.id !== undefined) {
        this.$router.push({
          name: "Document",
          params: { documentId: option.id },
        });
      }

      this.closeMe();
    },

    isOptionActive(list, index) {
      return index === this.activeItem && list === this.activeList;
    },

    setActiveOptionToIndex(list, index) {
      this.activeList = list;
      this.activeItem = index;
    },

    setActiveItem(value) {
      this.activeItem = this.activeItem + value;

      if (this.activeList === "commands") {
        if (this.activeItem < 0) {
          this.activeItem = 0;
        } else if (this.activeItem >= this.filteredActions.length) {
          if (this.filteredDocumentsSliced.length > 0) {
            this.activeItem = 0;
            this.activeList = "documents";
          } else {
            this.activeItem = this.filteredActions.length - 1;
          }
        }
      } else if (this.activeList === "documents") {
        if (this.activeItem < 0) {
          this.activeList = "commands";
          this.activeItem = this.filteredActions.length - 1;
        } else if (this.activeItem >= this.filteredDocumentsSliced.length) {
          this.activeItem = this.filteredDocumentsSliced.length - 1;
        }
      }
    },
  },

  mounted() {
    this.$refs.input.focus();
    this.activeItem = 0;

    this.unsubscribeAction = this.$store.subscribeAction({
      after: (action, state) => {
        console.log("aftersub", action, state);
      },
    });
  },

  beforeDestroy() {
    this.unsubscribeAction();
  },

  created() {
    commands.forEach((command) => {
      this.commands.push(command);
    });
  },
};
</script>
