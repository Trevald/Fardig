<template>
	<article>
		<AppDocumentText v-if="file" :file="file" :key="this.documentId" />
	</article>
</template>

<script>
	import AppDocumentText from "./AppDocumentText"

	export default {
		name: "AppDocument",

		components: {
			AppDocumentText,
		},

		computed: {
			documentId() {
				return this.$route.params.documentId
			},
			file() {
				return this.$store.getters.getDocumentById(this.documentId)
			},
		},

		mounted() {
			if (this.file !== undefined) {
				this.$store.commit("openDocument", this.file)
			}
			// this.documentId = this.$route.params.documentId;
		},
	}
</script>
