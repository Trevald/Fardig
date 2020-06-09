import { Node } from "tiptap"
import {
	sinkListItem,
	splitToDefaultListItem,
	liftListItem,
	toggleBlockType,
} from "tiptap-commands"
import AppTodo from "./../components/AppTodoItem"

export default class TodoItem extends Node {
	get name() {
		return "todo_item"
	}

	get defaultOptions() {
		return {
			nested: false,
		}
	}

	get view() {
		return AppTodo
	}

	get schema() {
		return {
			attrs: {
				done: {
					default: false,
				},
			},
			draggable: true,
			content: "inline*", // this.options.nested ? "(paragraph|todo_list)+" : "paragraph+",
			group: "block",
			toDOM: (node) => {
				const { done } = node.attrs

				return [
					"li",
					{
						"data-type": this.name,
						"data-done": done.toString(),
					},
					["span", { class: "todo-checkbox", contenteditable: "false" }],
					["div", { class: "todo-content" }, 0],
				]
			},
			parseDOM: [
				{
					priority: 51,
					tag: `[data-type="${this.name}"]`,
					getAttrs: (dom) => ({
						done: dom.getAttribute("data-done") === "true",
					}),
				},
			],
		}
	}

	keys({ type, schema, attrs }) {
		return {
			Enter: splitToDefaultListItem(type),
			Tab: this.options.nested ? sinkListItem(type) : () => {},
			"Shift-Tab": liftListItem(type),
			"Ctrl-t": toggleBlockType(type, schema.nodes.paragraph, attrs),
		}
	}
}
