<template>
	<article>
		<AppDocumentText v-if="fileIsLoaded" :file="file" :key="this.documentId" />
	</article>
</template>

<script>
	import AppDocumentText from "./AppDocumentText"

	export default {
		name: "AppDocument",

		components: {
			AppDocumentText,
		},

		beforeRouteUpdate(to, from, next) {
			this.$store.commit("setActiveDocument", {
				id: to.params.documentId,
			})
			next()
		},

		computed: {
			documentId() {
				return this.$route.params.documentId
			},
			file() {
				return this.$store.getters.getDocumentById(this.documentId)
			},

			fileIsLoaded() {
				return this.file?.isLoaded
			},
		},

		mounted() {
			if (this.file !== undefined) {
				this.$store.commit("openDocument", this.file)
			} else {
				const activeDocumentId = this.$store.getters.activeDocumentId
				if (activeDocumentId) {
					this.$router
						.push({
							name: "Document",
							params: { documentId: activeDocumentId },
						})
						.catch(() => {})
				}
			}
		},
	}
</script>
