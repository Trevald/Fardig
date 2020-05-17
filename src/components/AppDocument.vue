<template>
    <div v-show="activeFile.id === file.id" v-if="file.contents">
        <AppDocumentText v-if="fileType === 'todo'" :file="file" />
        <AppDocumentText v-else :file="file" />
    </div>
</template>

<script>

import AppDocumentText from "./AppDocumentText"

export default {

    name: "AppDocument",

    components: {
        AppDocumentText
    },

    props: {
        activeFile: Object,
        file: Object,
    },

    data() {
        return {
            fileType: undefined
        }
    },

    mounted() {
        this.fileType = "text/markdown"
    }

}

</script>