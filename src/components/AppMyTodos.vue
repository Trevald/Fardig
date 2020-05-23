<template>
  <div class="view-col">
    <h1>My ToDos</h1>
    <ul>
      <li
        v-for="document in documentsWithTodos"
        :key="document.id"
      >
        {{ getDocumentName(document) }}
        <ul>
          <li
            v-for="(todo, index) in getTodos(document)"
            :key="index"
          >
            {{ todo.textContent }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { documentGetName, documentGetTodos } from "./../utils/document";

export default {
  name: "AppMyTodos",

  data() {
    return {};
  },

  computed: {
    documentsWithTodos() {
      return this.$store.getters.documentsWithTodos;
    }
  },

  methods: {
    getDocumentName(doc) {
      return documentGetName(doc);
    },

    getTodos(doc) {
      return documentGetTodos(doc);
    }
  }
};
</script>
