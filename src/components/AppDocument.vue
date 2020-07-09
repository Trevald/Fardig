<template>
  <div>
    <AppDocumentText
      v-if="file"
      :file="file"
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
      console.log(this.documentId);
      return this.documentId !== undefined
        ? this.$store.getters.getDocumentById(this.documentId)
        : this.$store.activeDocumentId;
    }
  },

  mounted() {
    this.fileType = "text/markdown";
  }
};
</script>
