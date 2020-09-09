<template>
  <div class="app-status">
    <ul class="no-style">
      <li>{{saveState}}</li>
    </ul>
    <ul class="no-style">
      <li><button
          class="no-style"
          @click="toggleShortcuts"
        >Shortcuts</button></li>
      <li>
        <AppLogo />
      </li>
    </ul>
    <transition name="fade">
      <AppShortcuts v-if="shortcutsAreVisisble" />
    </transition>
  </div>
</template>

<script>
import AppLogo from "./AppLogo";
import AppShortcuts from "./AppShortcuts";

export default {
  name: "AppStatus",

  components: {
    AppLogo,
    AppShortcuts,
  },

  props: {
    hasUnsavedChanges: {
      type: Boolean,
      default: false,
    },
    isSaving: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      shortcutsAreVisisble: false,
    };
  },

  computed: {
    saveState() {
      if (this.isSaving === true) {
        return "Saving ...";
      }
      return this.hasUnsavedChanges === true
        ? "You have unsaved changes"
        : "All is calm";
    },

    saveAction() {
      return this.isSaving === true ? "Saving ..." : "";
    },
  },

  methods: {
    toggleShortcuts() {
      this.shortcutsAreVisisble = !this.shortcutsAreVisisble;
    },
  },
};
</script>

<style scoped>
ul {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

li {
  flex: 0 0 auto;
}

li:not(:last-child) {
  margin-right: 1rem;
}
</style>