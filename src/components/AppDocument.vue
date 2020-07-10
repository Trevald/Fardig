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
  /*
  watch: {
    $route(to, from) {
      if (to.params.documentId !== from.params.documentId) {
        console.log("watch");
        this.documentId = to.params.documentId;
      }
    }
  },
  */

  data() {
    return {
      fileType: undefined
    };
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
    this.fileType = "text/markdown";
    this.documentId = this.$route.params.documentId;
  }
};
</script>
