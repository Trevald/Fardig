<template>
    <div>
        <AppEditor :html="html" @change="htmlChanged" />
    </div>
</template>

<script>

import MarkdownService from "./../services/MarkdownService";

import AppEditor from './AppEditor.vue'

export default {

    name: "AppDocument",

    components: {
        AppEditor
    },

    props: {
        file: Object,
    },

    data() {
        return {
            markdownService: new MarkdownService(),
        }
    },

    computed: {
        html() {
            return this.file.contents ? this.markdownService.toHTML(this.file.contents) : undefined;
        }
    },

    methods: {
        htmlChanged(html) {
          const markdown = this.markdownService.fromHTML(html);
          const fileLastChanged = Date.now();

          this.file.contents = markdown;
          this.file.lastChanged = fileLastChanged;
        }
    }

}

</script>