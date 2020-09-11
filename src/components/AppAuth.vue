<template>
  <div>Auth</div>
</template>

<script>
export default {
  name: "AppAuth",

  mounted() {
    const documentId = this.$store.getters.activeDocumentId;
    this.$router.push({ name: "Document", params: { documentId: documentId } });
  },
};
</script>