<template>
	<header class="app-header">
		<nav class="tabs" v-if="openDocuments">
			<ul>
				<li v-for="(file, index) in openDocuments" :key="index">
					<router-link :to="{ name: 'Document', params: { documentId: file.id } }">
						{{ getTitle(file) }}
					</router-link>
				</li>
			</ul>
			<ul>
				<li class="todos-link">
					<router-link :to="{ name: 'Todos' }">
						Todos
					</router-link>
				</li>
			</ul>
		</nav>
	</header>
</template>

<script>
	import { documentGetTitle } from "./../utils/document"

	export default {
		name: "AppHeader",

		computed: {
			activeDocumentId() {
				return this.activeDocument ? this.activeDocument.id : undefined
			},
			activeDocument() {
				return this.$store.getters.activeDocument
			},

			activeView() {
				return this.$store.getters.activeView
			},

			openDocuments() {
				return this.$store.getters.openDocuments
			},
		},

		methods: {
			getTitle(title) {
				return documentGetTitle(title)
			},
			setActiveView(view, file) {
				this.$store.commit("setActiveView", { name: view })

				if (file) {
					this.$store.commit("setActiveDocument", { id: file.id })
				}
			},
		},
	}
</script>
