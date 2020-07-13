<template>
  <div>
    <AppDocumentText
      v-if="file"
      :file="file"
      :key="this.documentId"
    />
  </div>
</template>

<script>
import AppDocumentText from "./AppDocumentText";

export default {
  name: "AppDocument",

  components: {
    AppDocumentText
  },

  computed: {
    documentId() {
      return this.$route.params.documentId;
    },
    file() {
      return this.$store.getters.getDocumentById(this.documentId);
    }
  },

  mounted() {
    this.documentId = this.$route.params.documentId;
  }
};
</script>
