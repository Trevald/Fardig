<template>
	<div class="app-loader-image-progress" :class="progressCssClass">
		<div class="progress-wrapper">
			<div class="progress-bar" :style="progressStyle"></div>
			<svg viewBox="0 0 16 8" fill="currentColor">
				<path d="M8.00001 8L6.42143e-06 -3.49697e-07L16 3.18164e-08L8.00001 8Z" />
			</svg>
		</div>
	</div>
</template>

<script>
	import { FakeProgress } from "./../utils/FakeProgress"

	export default {
		name: "AppLoaderImageProgress",

		props: {
			direction: String,
		},

		data() {
			return {
				value: 90,
				max: 100,
				timeout: undefined,
				fakeProgress: new FakeProgress({
					timeConstant: 5000,
					autostart: false,
				}),
			}
		},

		computed: {
			progressCssClass() {
				return {
					"direction-up": this.direction === "up",
					"direction-down": this.direction !== "up",
					"is-done": this.progress === 100,
				}
			},

			progressStyle() {
				return {
					flexBasis: this.progress + "%",
					transition: this.progress === 100 ? "flex-basis 200ms ease" : "none",
				}
			},

			progress() {
				return this.fakeProgress.progress * 100
			},
		},

		methods: {
			done() {
				this.fakeProgress.end()
			},
		},

		mounted() {
			this.fakeProgress.start()
		},
	}
</script>

<style scoped>
	.__is-done .progress-bar {
		transition: flex-basis 2s ease;
	}
</style>
