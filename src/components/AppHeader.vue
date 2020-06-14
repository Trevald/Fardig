<template>
  <header class="app-header">

    <nav
      class="tabs"
      v-if="openDocuments"
    >
      <ul>
        <li
          v-for="file in openDocuments"
          :key="file.id"
          :class="{'is-active': activeDocumentId === file.id && activeView === 'editor'}"
        >
          <button
            class="no-style"
            type="button"
            @click="setActiveView('editor', file)"
          >
            {{ getTitle(file) }}
          </button>
        </li>
      </ul>
      <ul>
        <li
          class="todos-link"
          :class="{ 'is-active': activeView === 'todo' }"
        >
          <button
            class="no-style"
            type="button"
            @click="setActiveView('todo')"
          >
            ToDos
          </button>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { documentGetTitle } from "./../utils/document";

export default {
  name: "AppHeader",

  computed: {
    activeDocumentId() {
      return this.activeDocument ? this.activeDocument.id : undefined;
    },
    activeDocument() {
      return this.$store.getters.activeDocument;
    },

    activeView() {
      return this.$store.getters.activeView;
    },

    openDocuments() {
      return this.$store.getters.openDocuments;
    }
  },

  methods: {
    getTitle(title) {
      return documentGetTitle(title);
    },
    setActiveView(view, file) {
      this.$store.commit("setActiveView", { name: view });

      if (file) {
        this.$store.commit("setActiveDocument", { id: file.id });
      }
    }
  }
};
</script>