<template>
  <article class="app-presentation-slide">
    <div ref="container"></div>

  </article>
</template>

<script>
import { DOMSerializer } from "prosemirror-model";
import { schema } from "./../../prosemirror/schema";

export default {
  name: "AppPresentationSlide",

  props: {
    content: Array,
  },

  computed: {
    html() {
      const doc = schema.node("doc", null, this.content);
      console.log(2, doc);
      const html = DOMSerializer.fromSchema(schema).serializeFragment(doc);
      console.log(2, html);

      return html;
    },
  },

  mounted() {
    this.$refs.container.appendChild(this.html);
  },
};
</script>
