export default {
	data() {
		return {
			keymap: {
				"ctrl+n": (event) => {
					event.preventDefault()
					this.newDocument()
				},
				"meta+s": (event) => {
					event.preventDefault()
					this.upload()
				},
				"meta+p": (event) => {
					event.preventDefault()
					this.showCommand = !this.showCommand
				},
			},
		}
	},

	methods: {
		newDocument() {
			this.$store.dispatch("newDocument").then((doc) => {
				this.$router.push({
					name: "Document",
					params: { documentId: doc.id },
				})
			})
		},
	},
}
