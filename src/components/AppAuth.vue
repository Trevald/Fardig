<template>
  <div>Auth</div>
</template>

<script>
import DropboxApi from "./../cloud/dropbox";

import { getPreferencesProp } from "./../utils/preferences";
export default {
  name: "AppAuth",

  mounted() {
    const dropboxApi = new DropboxApi();
    const oldToken = getPreferencesProp("accessToken");
    const newToken = dropboxApi.accessToken;
    const accessToken = newToken || oldToken;
    console.log(accessToken);

    this.$store.commit("setAccessToken", { accessToken });
    const documentId = this.$store.getters.activeDocumentId;
    this.$router.push({ name: "Document", params: { documentId: documentId } });
  },
};
</script>