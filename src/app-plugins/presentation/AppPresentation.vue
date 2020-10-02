<template>
  <div>
    <AppPresentationSlide
      v-for="(slide, index) in slides"
      :key="index"
      :content="slide"
    />
  </div>
</template>

<script>
import { Node, DOMSerializer } from "prosemirror-model";
import {
  nodeIsH1,
  nodeIsH2,
  nodeIsBlockquote,
} from "./../../prosemirror/helpers";
import { schema } from "./../../prosemirror/schema";

import AppPresentationSlide from "./AppPresentationSlide";

export default {
  name: "AppPresentation",

  components: {
    AppPresentationSlide,
  },

  data() {
    return {
      slides: [],
    };
  },

  computed: {
    documentId() {
      return this.$route.params.documentId;
    },

    file() {
      return this.$store.getters.getDocumentById(this.documentId);
    },
  },

  methods: {
    createSlides(root) {
      root.forEach((node) => {
        if (this.nodeShouldCreateNewSlide(node)) {
          this.slides.push([node]);
        } else {
          this.slides[this.slides.length - 1].push(node);
        }
      });
    },

    nodeShouldCreateNewSlide(node) {
      return nodeIsH1(node) || nodeIsH2(node) || nodeIsBlockquote(node);
    },
  },

  mounted() {
    const node = Node.fromJSON(schema, this.file.json);

    // const domParser = new DomParser(schema);

    const result = DOMSerializer.fromSchema(schema).serializeFragment(node);
    this.createSlides(node);

    console.log(result, node);
    console.log(this.slides);
  },
};
</script>

<style>
@import "./app-presentation-slide.css";
</style>