<template>
  <progress
    :value="value"
    :max="max"
  >{{value}} / {{max}}</progress>
</template>

<script>
export default {
  name: "AppProgress",

  props: {
    value: Number,
    max: Number
  }
};
</script>