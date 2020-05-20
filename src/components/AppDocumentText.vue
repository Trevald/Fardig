<template>
	<div>
		<AppEditor :json="json" @change="contentChanged" />
	</div>
</template>

<script>
	import MarkdownService from "./../services/MarkdownService"

	import AppEditor from "./AppEditor.vue"

	export default {
		name: "AppDocument",

		components: {
			AppEditor,
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
			json() {
				return this.file.json
			},
		},

		methods: {
			contentChanged(data) {
				const json = data.json

				const fileLastChanged = Date.now()
				this.$store.commit("updateDocument", {
					id: this.file.id,
					json: json,
					lastChanged: fileLastChanged,
				})
			},
		},
	}
</script>
