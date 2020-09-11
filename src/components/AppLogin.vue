<template>
  <div class="app-login">
    <div class="app-login-content">

      <a
        class="button primary"
        v-if="dropboxAuthLink"
        :href="dropboxAuthLink"
      >Login with Dropbox</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppLogin",

  computed: {
    dropboxAuthLink() {
      return this.$store.getters.dropboxAuthLink;
    },
  },
};
</script>
