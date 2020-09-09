<template>
  <div class="icon">

    <svg
      fill="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      viewBox="0 0 20 20"
      v-html="svgContent"
    >
    </svg>

  </div>
</template>

<script>
export default {
  name: "AppIcon",

  props: {
    svg: [String, Object],
  },

  computed: {
    svgContent() {
      if (typeof this.svg === "string") {
        return this.svg;
      } else {
        return this.$store.getters.darkMode === true
          ? this.svg.dark
          : this.svg.light;
      }
    },
  },
};
</script>