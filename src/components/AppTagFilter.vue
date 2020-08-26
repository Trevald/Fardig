<template>
  <ul
    class="no-style filter"
    :class="{'has-selection': hasActiveTags}"
  >
    <li
      v-for="(tag, index) in tags"
      :key="index"
    >
      <button
        class="no-style tag"
        :class="{'outline': !isTagActive(tag), 'is-active': !isTagActive(tag)}"
        @click="toggleTag(tag)"
      >{{tag}}</button>
    </li> {{this.activeTags.size}}
  </ul>
</template>

<script>
export default {
  name: "AppTagFilter",

  props: {
    tags: Array,
  },

  data() {
    return {
      activeTags: [],
    };
  },

  computed: {
    hasActiveTags() {
      return this.activeTags.length > 0;
    },
  },

  methods: {
    isTagActive(tag) {
      console.log(12, this.activeTags);
      return this.activeTags.includes(tag);
    },

    toggleTag(tag) {
      if (this.isTagActive(tag)) {
        const index = this.activeTags.indexOf(tag);
        this.activeTags.splice(index, 1);
      } else {
        this.activeTags.push(tag);
      }

      this.$emit("filterChanged", [...this.activeTags]);
    },
  },
};
</script>

<style>
.filter {
  display: flex;
  justify-content: flex-start;
  margin: 0 -0.5rem 1rem -0.5rem;
}

.filter > li {
  margin: 0.5rem;
}

/*
.filter.has-selection button:not(.is-active) {
  opacity: 0.5;
}
*/
</style>