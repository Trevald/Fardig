<template>
	<div v-show="isActiveFile" v-if="hasContent">
		<AppDocumentText v-if="fileType === 'todo'" :file="file" />
		<AppDocumentText v-else :file="file" />
	</div>
</template>

<script>
	import AppDocumentText from "./AppDocumentText"

	export default {
		name: "AppDocument",

		components: {
			AppDocumentText,
		},

		props: {
			file: Object,
		},

		data() {
			return {
				fileType: undefined,
			}
		},

		computed: {
			hasContent() {
				return this.file.json
			},

			isActiveFile() {
				return this.$store.getters.activeDocument.id === this.file?.id
			},
		},

		mounted() {
			this.fileType = "text/markdown"
		},
	}
</script>
