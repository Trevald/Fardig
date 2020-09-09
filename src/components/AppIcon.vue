<template>
  <div class="icon">

    <svg
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      {{svg}}
    </svg>

  </div>
</template>

<script>
export default {
  name: "AppIcon",

  props: {
    svg: String,
  },
};
</script>