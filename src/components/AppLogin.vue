<template>
  <div class="app-login-content">
    <AppLogo />
    <a
      class="button primary"
      v-if="dropboxAuthLink"
      :href="dropboxAuthLink"
    >Login with Dropbox</a>
  </div>
</template>

<script>
import AppLogo from "./AppLogo";
import DropboxApi from "./../cloud/dropbox";
export default {
  name: "AppLogin",

  components: {
    AppLogo
  },

  data() {
    return {
      dropboxAuthLink: undefined
    };
  },

  mounted() {
    const dropboxApi = new DropboxApi();
    this.dropboxAuthLink = dropboxApi.getAuthUrl();
  }
};
</script>