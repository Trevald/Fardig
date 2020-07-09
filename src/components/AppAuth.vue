<template>
  <div>Auth</div>
</template>

<script>
import DropboxApi from "./../cloud/dropbox";
export default {
  name: "AppAuth",

  mounted() {
    const dropboxApi = new DropboxApi();
    const accessToken = dropboxApi.accessToken;

    this.$store.commit("setAccessToken", { accessToken });
    const documentId = this.$store.getters.activeDocumentId;
    this.$router.push({ name: "Document", params: { documentId: documentId } });
  }
};
</script>