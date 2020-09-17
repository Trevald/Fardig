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
				return this.node.attrs.src
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
				const fileName = image.name
				const file = await this.$store.dispatch("storeContents", {
					contents: new Blob([image], { type: image.type }),
					autorename: true,
					mode: "add",
					path: `/images/${fileName}`,
				})
				console.log("Image Vue  uploadImageDone", file)

				return file
			},
		},

		mounted() {
			const { imageData } = this.node.attrs
			console.log(this.node.attrs)
			if (imageData) {
				this.uploadImage(imageData).then((fileData) => {
					this.updateAttrs({
						path: fileData.path_lower,
						id: fileData.id,
					})
				})
			}
		},
	}
</script>

<style>
	figure {
		display: inline-block;
		margin: 0 0 2rem 0;
		padding: 1rem;
		background: rgba(0, 0, 0, 0.5);
		border: 2px solid rgba(0, 0, 0, 0.85);
	}
</style>
