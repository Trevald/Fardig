<template>
	<div class="view-col">
		<h1>My ToDos</h1>
		<article v-for="document in documentsWithTodos" :key="document.id">
			<h2>
				<router-link :to="{ name: 'Document', params: { documentId: document.id } }">{{
					getDocumentName(document)
				}}</router-link>
			</h2>
			<ul data-type="todo_list">
				<AppTodoSingle
					v-for="(todo, index) in getTodos(document)"
					:key="index"
					:todo="todo"
					>{{ todo.textContent }}</AppTodoSingle
				>
			</ul>
		</article>
	</div>
</template>

<script>
	import { documentGetName, documentGetTodos } from "./../utils/document"
	import AppTodoSingle from "./AppTodoSingle"

	export default {
		name: "AppMyTodos",

		components: {
			AppTodoSingle,
		},

		data() {
			return {}
		},

		computed: {
			documentsWithTodos() {
				return this.$store.getters.documentsWithTodos
			},
		},

		methods: {
			getDocumentName(doc) {
				return documentGetName(doc)
			},

			getTodos(doc) {
				return documentGetTodos(doc)
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
</style>
