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
    import { Node } from "prosemirror-model"
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

			const doc = schema.node("doc", null, todos).toJSON()

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

				onUpdate: ({ getJSON }) => {
                    const json = getJSON()
                    const newTodos = documentGetTodos({json})

                    const doc = Node.fromJSON(schema, this.document.json)
                    console.log(doc.toJSON(), this.document.json)

                    doc.content.descendants((node, pos, parent) => {
                        
                        if (node.type.name !== "todo_item") return

                        const id = node.attrs.id
                        
                        const newTodo = this.getTodoById(newTodos, id)
                        if (!newTodo) {
                            console.error(`No todo_item with id ${id}`)
                            return
                        }

                        node.attrs = newTodo.attrs
                        node.content = newTodo.content

                        console.log(node, newTodo, pos, parent)

                    })
                    
                    console.log(doc.toJSON())
                    
                    const fileLastChanged = Date.now()
                    this.$store.commit("updateDocument", {
                        id: this.documentId,
                        json: doc.toJSON(),
                        lastChanged: fileLastChanged,
                    })
                    
                    
				},
			})
		},
		methods: {

            getTodoById(nodes, id) {
                return nodes.find(node => node.attrs.id === id)
            },
            
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
