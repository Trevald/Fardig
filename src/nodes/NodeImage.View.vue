<template>
	<figure>
		<img :src="src" :alt="alt" :title="title" :data-id="id" :data-path="path" />
	</figure>
</template>

<script>
	export default {
		name: "AppImage",

		props: ["node", "updateAttrs", "view"],

		data() {
			return {}
		},

		computed: {
			id() {
				return this.node.attrs.id
			},
			src() {
				return this.node.attrs.base64 || this.node.attrs.path
			},
			alt() {
				return this.node.attrs.alt
			},
			title() {
				return this.node.attrs.title
			},
			path() {
				return this.node.attrs.path
			},
		},

		methods: {
			async uploadImage(image) {
				console.log("Image Vue Uploading…", image)
				const fileName = this.makeSafeMDFileName(image.name)
				try {
					const file = await this.$store.dispatch("storeContents", {
						contents: new Blob([image], { type: image.type }),
						autorename: true,
						mode: "add",
						path: `/images/${fileName}`,
					})
					console.log("Image Vue  uploadImageDone", file)

					return file
				} catch (error) {
					console.error("Failed to upload image", error)
				}
			},

			makeSafeMDFileName(fileName) {
				const parts = fileName.split(".")
				const suffix = parts[parts.length - 1]
				const name = parts.slice(0, parts.length - 1).join("")
				const safeName = name.replace(/ /g, "_").replace(/\)|\(|\]|\[/g, "-")

				return `${safeName}-${Date.now()}.${suffix}`
			},

			addNewImage(imageData) {
				this.uploadImage(imageData).then((fileData) => {
					this.updateAttrs({
						path: fileData.path_lower,
						id: fileData.id,
					})
				})
			},

			async getExistingImage(path) {
				const base64 = await this.$store.dispatch("getFile", path)

				this.updateAttrs({
					base64: base64,
				})
			},
		},

		mounted() {
			const { imageData, path } = this.node.attrs

			console.log("Image mounted", imageData, path)

			if (imageData) {
				this.addNewImage(imageData)
			} else if (path) {
				this.getExistingImage(path)
			}
		},
	}
</script>
