<template>
  <div class="view-col">
    <h1>My ToDos</h1>
    <article
      v-for="document in documentsWithTodos"
      :key="document.id"
    >
      <h2>{{ getDocumentName(document) }}</h2>
      <ul class="no-style">
        <li
          v-for="(todo, index) in getTodos(document)"
          :key="index"
        >
          <AppTodoSingle :todo="todo">{{ todo.textContent }}</AppTodoSingle>
        </li>
      </ul>
    </article>
  </div>
</template>

<script>
import { documentGetName, documentGetTodos } from "./../utils/document";
import AppTodoSingle from "./AppTodoSingle";

export default {
  name: "AppMyTodos",

  components: {
    AppTodoSingle
  },

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
