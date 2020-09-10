<template>
  <div class="app-login">
    <div class="app-login-content">
      <AppLogo />
      <a
        class="button primary"
        v-if="dropboxAuthLink"
        :href="dropboxAuthLink"
      >Login with Dropbox</a>
    </div>
  </div>
</template>

<script>
import AppLogo from "./AppLogo";

export default {
  name: "AppLogin",

  components: {
    AppLogo,
  },
  computed: {
    dropboxAuthLink() {
      return this.$store.getters.dropboxAuthLink;
    },
  },
};
</script>
