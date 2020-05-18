<template>
	<div>
		<AppEditor :html="html" @change="contentChanged" />
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
			html() {
				return this.file.contents
					? this.markdownService.toHTML(this.file.contents)
					: undefined
			},
		},

		methods: {
			contentChanged(data) {
				const html = data.html
				const json = data.json
				const markdown = this.markdownService.fromHTML(html)
				const fileLastChanged = Date.now()
				this.$store.commit("updateDocument", {
					id: this.file.id,
					contents: markdown,
					json: json,
					lastChanged: fileLastChanged,
				})
			},
		},
	}
</script>
