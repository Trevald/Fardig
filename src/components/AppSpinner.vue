<template>
	<div class="app-spinner">
		<div class="app-spinner-area"></div>
	</div>
</template>

<script>
	export default {
		name: "AppSpinner",

		props: {
			size: Number,
		},

		computed: {
			css() {
				const size = this.size || 10
				return {
					width: `${size}%`,
					"padding-bottom": `${size}%`,
				}
			},
		},
	}
</script>
