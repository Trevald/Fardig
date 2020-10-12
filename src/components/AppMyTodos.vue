<template>
	<div class="view-col">
		<h1>My ToDos</h1>

		<AppTagFilter :tags="tags" />

		<AppTodoDocument
			v-for="document in documentsWithTodosFiltered"
			:key="document.id"
			:documentId="document.id"
		/>
	</div>
</template>

<script>
	import {
		documentGetName,
		documentGetTodos,
		documentHasTags,
		documentGetTagsLabels,
	} from "./../utils/document"
	import AppTagFilter from "./AppTagFilter"
	import AppTodoDocument from "./AppTodoDocument"

	export default {
		name: "AppMyTodos",

		components: {
			AppTodoDocument,
			AppTagFilter,
		},

		data() {
			return {}
		},

		computed: {
			documentsWithTodos() {
				return this.$store.getters.documentsWithNotStartedTodos
			},

			documentsWithTodosFiltered() {
				if (!this.filter) {
					return this.documentsWithTodos
                }
                
                const filter = this.filter.split(",")
				const docs = this.documentsWithTodos
				const filteredDocs = docs.filter((doc) => {
                    const docTagsLabels = documentGetTagsLabels(doc)

                    return filter.every((tagLabel) => {
                       return  docTagsLabels.includes(tagLabel)
                    })
				})

				return filteredDocs
			},

			tags() {
				return this.$store.getters.tags
			},

			filter() {
				return this.$route.query.filter
			},
		},

		methods: {
			getDocumentName(doc) {
				return documentGetName(doc)
			},

			getTodos(doc) {
				return documentGetTodos(doc)
			},

			getTags(doc) {
				return documentGetTagsLabels(doc)
			},

			hasTags(doc) {
				return documentHasTags(doc)
			},
		},
	}
</script>

<style scoped>
	h2 a {
		text-decoration: none;
	}

	h2 a:hover {
		text-decoration: underline;
	}

	.tags {
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		margin-bottom: 1rem;
	}

	.tags > li:not(:last-child) {
		margin-right: 1rem;
	}
</style>
