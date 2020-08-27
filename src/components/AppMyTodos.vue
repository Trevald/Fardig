<template>
  <div class="view-col">
    <h1>My ToDos</h1>

    <AppTagFilter :tags="tags" />

    <article
      v-for="document in documentsWithTodosFiltered"
      :key="document.id"
    >
      <h2>
        <router-link :to="{ name: 'Document', params: { documentId: document.id } }">{{
					getDocumentName(document)
				}}</router-link>
      </h2>
      <ul
        v-if="hasTags(document)"
        class="no-style tags"
      >
        <li
          v-for="(tag, index) in getTags(document)"
          :key="index"
          :tag="tag"
        ><span class="tag">{{tag}}</span></li>
      </ul>
      <ul data-type="todo_list">
        <AppTodoSingle
          v-for="(todo, index) in getTodos(document)"
          :key="index"
          :todo="todo"
        >{{ todo.textContent }}</AppTodoSingle>
      </ul>
    </article>
  </div>
</template>

<script>
import {
  documentGetName,
  documentGetTodos,
  documentHasTags,
  documentGetTagsLabels,
} from "./../utils/document";
import AppTodoSingle from "./AppTodoSingle";
import AppTagFilter from "./AppTagFilter";

export default {
  name: "AppMyTodos",

  components: {
    AppTagFilter,
    AppTodoSingle,
  },

  data() {
    return {};
  },

  computed: {
    documentsWithTodos() {
      return this.$store.getters.documentsWithTodos;
    },

    documentsWithTodosFiltered() {
      if (!this.filter) {
        return this.documentsWithTodos;
      }

      const docs = this.documentsWithTodos;
      const filteredDocs = docs.filter((doc) => {
        const docTagsLabels = documentGetTagsLabels(doc);
        return docTagsLabels.some((tagLabel) => {
          return this.filter.includes(tagLabel);
        });
      });

      return filteredDocs;
    },

    tags() {
      return this.$store.getters.tags;
    },

    filter() {
      return this.$route.query.filter;
    },
  },

  methods: {
    getDocumentName(doc) {
      return documentGetName(doc);
    },

    getTodos(doc) {
      return documentGetTodos(doc);
    },

    getTags(doc) {
      return documentGetTagsLabels(doc);
    },

    hasTags(doc) {
      return documentHasTags(doc);
    },
  },
};
</script>

<style scoped>
h2 a {
  text-decoration: none;
}

h2 a:hover {
  text-decoration: underline;
}

.tags {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.tags > li:not(:last-child) {
  margin-right: 1rem;
}
</style>
