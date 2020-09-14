<template>
	<div id="app">
		<AppProgress
			v-if="!appReady"
			:value="numberOfFilesLoaded"
			:max="totalNumberOfFiles"
			class="app-progress"
		/>
		<div class="view-col" v-hotkey="keymap" v-if="appReady">
			<AppHeader v-if="appReadyAndLoggedIn" />

			<main class="app-main" v-if="appReady">
				<div class="container" style="display: flex">
					<div class="view">
						<router-view></router-view>
					</div>
				</div>
			</main>
			<AppStatus
				v-if="appReadyAndLoggedIn"
				class="app-status"
				:isSaving="isUploading"
				:hasUnsavedChanges="hasUnsavedChanges"
			/>
			<transition name="fade">
				<AppCommand v-if="commandIsVisible && appReadyAndLoggedIn" />
			</transition>
		</div>
	</div>
</template>

<script>
	import AppCommand from "./components/AppCommand"
	import AppHeader from "./components/AppHeader"
	import AppProgress from "./components/AppProgress"
	import AppStatus from "./components/AppStatus"

	import { commands } from "./commands/commands"

	export default {
		name: "App",

		components: {
			AppCommand,
			AppHeader,
			AppProgress,
			AppStatus,
		},

		data() {
			return {
				keymap: {},
			}
		},

		computed: {
			appReady() {
				return (
					!this.loggedIn ||
					(this.loggedIn && this.numberOfFilesLoaded >= this.totalNumberOfFiles)
				)
			},

			appReadyAndLoggedIn() {
				return this.loggedIn && this.numberOfFilesLoaded >= this.totalNumberOfFiles
			},

			numberOfFilesLoaded() {
				return this.$store.getters.documentsLoaded.length
			},

			totalNumberOfFiles() {
				return this.$store.getters.allDocuments.length
			},

			documentId() {
				return this.$route.params.documentId
			},

			activeView() {
				return this.$store.getters.activeView
			},

			loggedIn() {
				return this.$store.getters.isAuthenticated
			},

			activeDocument() {
				return this.$store.getters.getDocumentById(this.documentId)
			},

			commandIsVisible() {
				return this.$store.getters.commandIsVisible
			},

			openDocuments() {
				return this.$store.getters.openDocuments
			},

			documents() {
				return this.$store.getters.allDocuments
			},

			isUploading() {
				return this.activeDocument?.isUploading
			},

			lastChanged() {
				return this.activeDocument?.lastChanged
			},

			lastUpdated() {
				return this.activeDocument?.lastUpdated
			},

			hasUnsavedChanges() {
				return this.lastUpdated < this.lastChanged
			},
		},

		methods: {
			login() {
				if (this.$store.getters.isAuthenticated) {
					this.$store.dispatch("fetchDocuments")
				}
			},

			setActiveView(view, file) {
				this.$store.commit("setActiveView", { name: view })

				if (file) {
					this.$store.commit("setActiveDocument", { id: file.id })
				}
			},

			beforeUnload(event) {
				if (this.hasUnsavedChanges || this.isUploading) {
					// Cancel the event as stated by the standard.
					event.preventDefault()

					// Chrome requires returnValue to be set.
					event.returnValue = ""
				}
			},
		},

		mounted() {
			this.login()

			window.addEventListener("beforeunload", this.beforeUnload)
		},

		created() {
			commands.forEach((command) => {
				if (command.shortcut) {
					this.keymap[command.shortcut] = (event) => {
						event.preventDefault()
						this.$store.dispatch(command.action)
					}
				}
			})
		},
	}
</script>

<style scoped>
	.app-progress {
		position: fixed;
		top: 50%;
		left: 50%;

		transform: translate(-50%, -50%);
	}
</style>
