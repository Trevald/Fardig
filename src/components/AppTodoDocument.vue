<template>
	<article>
		<h2>
			<router-link :to="{ name: 'Document', params: { documentId: document.id } }">{{
				getDocumentName(document)
			}}</router-link>
		</h2>
		<ul v-if="hasTags(document)" class="no-style tags">
			<li v-for="(tag, index) in getTags(document)" :key="index" :tag="tag">
				<span class="tag">{{ tag }}</span>
			</li>
		</ul>
		<editor-content :editor="editor" />
		<ul data-type="todo_list">
			<!--
			<AppTodoSingle v-for="(todo, index) in getTodos(document)" :key="index" :todo="todo">{{
				todo.textContent
			}}</AppTodoSingle>
            -->
		</ul>
	</article>
</template>

<script>
	import { Editor, EditorContent } from "tiptap"
	// import { Schema } from "prosemirror-model"
	// import { Fragment } from "prosemirror-model"
	// import { Node } from "prosemirror-model"

	import TodoItem from "./../prosemirror/TodoItemNode"
	import {
		HardBreak,
		Code,
		Link,
		Strike,
		History,
		// Mention
	} from "tiptap-extensions"
	import { schema } from "./../prosemirror/schema"
	import TodoList from "./../prosemirror/TodoListNode"
	import Bold from "./../prosemirror/nodes/Bold"
	import Italic from "./../prosemirror/nodes/Italic"

	import {
		documentGetName,
		documentGetTodos,
		documentGetTodoLists,
		documentHasTags,
		documentGetTagsLabels,
	} from "./../utils/document"

	export default {
		name: "AppTodoDocument",

		components: {
			EditorContent,
		},

		props: {
			documentId: String,
		},

		data() {
			return {
				editor: null,
				schema: undefined,
				json: undefined,
			}
		},

		computed: {
			document() {
				return this.$store.getters.getDocumentById(this.documentId)
			},
		},

		created() {
			this.schema = schema
		},

		mounted() {
			const todos = documentGetTodos(this.document)
			const todoLists = documentGetTodoLists(this.document)

			const doc = schema.node("doc", null, todos).toJSON()
			// const doc = this.schema

			console.log("doc", doc, todoLists)
			this.editor = new Editor({
				extensions: [
					new TodoItem({ todoList: true }),
					new HardBreak(),
					new TodoList(),
					new Bold(),
					new Code(),
					new Italic(),
					new Link(),
					new Strike(),
					new History(),
				],
				content: doc,

				onUpdate: ({ transaction }) => {
					// const json = getJSON()

					console.log("update", transaction)
				},
			})
		},
		methods: {
			getDocumentName(doc) {
				return documentGetName(doc)
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
