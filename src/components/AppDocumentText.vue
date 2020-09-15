<template>
	<AppEditor :json="json" @change="contentChanged" />
</template>

<script>
	import AppEditor from "./AppEditor.vue"

	export default {
		name: "AppDocument",

		components: {
			AppEditor,
		},

		props: {
			file: Object,
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
