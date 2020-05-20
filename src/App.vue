<template>
	<div id="app" v-hotkey="keymap">
		<header class="app-header">
			<a v-if="dropboxAuthLink" :href="dropboxAuthLink">Login with Dropbox</a>

			<nav class="tabs">
				<ul>
					<li
						v-for="file in openDocuments"
						:key="file.id"
						:class="{
							'is-active': activeDocument.id === file.id && activeView === 'editor',
						}"
					>
						<button
							class="no-style"
							type="button"
							@click="setActiveView('editor', file)"
						>
							{{ file.title }}
						</button>
					</li>
				</ul>
				<ul>
					<li class="todos-link" :class="{ 'is-active': activeView === 'todo' }">
						<button class="no-style" type="button" @click="setActiveView('todo')">
							ToDos
						</button>
					</li>
				</ul>
			</nav>
		</header>

		<main class="app-main">
			<div class="container" :class="{ 'show-baseline-grid': shouldShowGrid, view: true }">
				<ul class="no-list view" v-if="activeView === 'todo'">
					<li><AppMyTodosVue /></li>
				</ul>

				<ul class="no-list view" v-else>
					<li
						v-for="file in openDocuments"
						:key="file.id"
						class="view"
						v-show="activeDocument.id === file.id"
					>
						<AppDocument :file="file" />
					</li>
				</ul>
			</div>
		</main>

		<AppStatus
			class="app-status"
			:isSaving="isUploading"
			:hasUnsavedChanges="hasUnsavedChanges"
		/>
		<transition name="fade">
			<AppCommand v-if="showCommand" :documents="documents" @command="doCommand" />
		</transition>
	</div>
</template>

<script>
	import AppCommand from "./components/AppCommand"
	import AppDocument from "./components/AppDocument"
	import AppStatus from "./components/AppStatus.vue"
	import DropboxApi from "./cloud/dropbox"

	import UserService from "./services/UserService"
	import AppMyTodosVue from "./components/AppMyTodos.vue"

	import { documentGetCommitMode } from "./utils/document"

	import { markdownParser, markdownRenderer } from "./prosemirror/markdown-parser"
	import { markdownSerializer } from "./prosemirror/markdown-serializer"
	import { EditorState } from "prosemirror-state"
	import { Node } from "prosemirror-model"
	import { schema } from "./utils/schema"

	export default {
		name: "App",

		components: {
			AppCommand,
			AppDocument,
			AppMyTodosVue,
			AppStatus,
		},

		data() {
			return {
				userService: new UserService(),
				dropboxAuthLink: undefined,
				cloudStorage: undefined,
				fileMeta: undefined,
				newFile: undefined,
				shouldShowGrid: false,
				showCommand: false,
				activeView: "editor",
			}
		},

		computed: {
			activeDocument() {
				return this.$store.getters.activeDocument
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

			fileContents() {
				return this.activeDocument?.contents
			},

			hasUnsavedChanges() {
				return this.lastUpdated < this.lastChanged
			},

			keymap() {
				return {
					"ctrl+s": () => {
						this.upload()
					},
					"ctrl+space": () => {
						this.showCommand = !this.showCommand
					},
					"ctrl+p": () => {
						this.showCommand = !this.showCommand
					},
					"ctrl+q": () => {
						this.switchactiveDocument(-1)
					},
					"ctrl+w": () => {
						this.switchactiveDocument(1)
					},
				}
			},
		},

		methods: {
			doCommand(event) {
				console.log("doCommand", event.command)
				switch (event.command) {
					case "CLOSE_ME":
						// this.showCommand = false;
						break
					case "NEW_FILE":
						this.$store.commit("newDocument")
						break
					case "OPEN":
						this.$store.commit("setActiveDocument", {
							id: event.id,
						})
						break
					default:
						break
				}
				this.showCommand = false
				this.savePreferences()
			},

			switchactiveDocument(indexModifier) {
				const openDocumentsArray = [...this.openDocuments]
				const activeDocumentIndexInopenDocuments = openDocumentsArray.findIndex(
					(file) => file.id === this.activeDocument.id
				)
				if (activeDocumentIndexInopenDocuments === -1) {
					return
				}

				let newactiveDocumentIndex = activeDocumentIndexInopenDocuments + indexModifier
				if (newactiveDocumentIndex <= -1) {
					newactiveDocumentIndex = openDocumentsArray.length - 1
				} else if (newactiveDocumentIndex >= openDocumentsArray.length) {
					newactiveDocumentIndex = 0
				}
				this.$store.commit("setActiveDocument", {
					id: openDocumentsArray[newactiveDocumentIndex].id,
				})

				return false
			},

			upload() {
				const fileToUpload = this.activeDocument

				const filesCommitInfo = {
					contents: fileToUpload.blob,
					autorename: false,
					mode: documentGetCommitMode(fileToUpload),
					path: fileToUpload.path,
				}

				this.$store.commit("updateDocument", {
					id: fileToUpload.id,
					isUploading: true,
					lastUpdated: fileToUpload.lastChanged,
				})

				const pureJson = fileToUpload.json

				const state = EditorState.create({
					doc: Node.fromJSON(schema, pureJson),
				})
				console.log("serie 1", state)
				const serialized = markdownSerializer.serialize(state.doc)

				console.log("serie 2", filesCommitInfo, serialized)

				filesCommitInfo.contents = serialized

				this.cloudStorage.storeContents(filesCommitInfo).then(() => {
					this.$store.commit("updateDocument", {
						id: fileToUpload.id,
						isUploading: false,
					})
				})
			},

			toggleGrid() {
				this.shouldShowGrid = !this.shouldShowGrid
				document.querySelector("html").classList.toggle("toggle-grid", this.shouldShowGrid)
			},

			login() {
				this.cloudStorage = new DropboxApi()
				if (!this.cloudStorage.isAuthenticated()) {
					this.dropboxAuthLink = this.cloudStorage.getAuthUrl()
				} else {
					this.cloudStorage.getEntries().then((files) => {
						let loadedFiles = []
						files.forEach((file) => {
							this.cloudStorage.getContents(file.path_lower).then((fileContent) => {
								const data = file
								data.contents = fileContent
								console.log(
									"json 1",
									file.path_lower,
									markdownRenderer.render(fileContent)
								)
								data.json = JSON.parse(
									JSON.stringify(markdownParser.parse(fileContent))
								)

								this.$store.commit("addDocument", data)
								loadedFiles.push(file.id)
								if (loadedFiles.length === files.length) {
									this.allFilesLoaded()
								}
							})
						})
					})
				}
			},

			allFilesLoaded() {
				this.documents.forEach((file) => {
					if (this.userService.activeFile === file.id) {
						this.$store.commit("setActiveDocument", { id: file.id })
					} else if (this.userService.openFiles.has(file.id)) {
						this.$store.commit("openDocument", { id: file.id })
					}
				})

				if (this.activeDocument === undefined) {
					this.$store.commit("setActiveDocument", {
						id: this.$store.getters.firstDocument.id,
					})
				}
			},

			savePreferences() {
				this.userService.updatePrefs({
					activeFile: this.activeDocument,
					openFiles: this.openDocuments,
				})
			},

			setActiveView(view, file) {
				this.activeView = view
				if (file) {
					this.$store.commit("setActiveDocument", { id: file.id })
				}
			},
		},

		created() {},

		mounted() {
			this.login()
		},
	}
</script>

<style scoped>
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.2s;
	}
	.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
		opacity: 0;
	}
</style>
