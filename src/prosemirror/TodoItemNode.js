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
				status: {
					default: "not started",
				},
			},
			draggable: true,
			content: "inline*", // this.options.nested ? "(paragraph|todo_list)+" : "paragraph+",
			group: "block",
			toDOM: (node) => {
				const { status } = node.attrs
				console.log("status", status, node.attrs)
				return [
					"li",
					{
						"data-type": this.name,
						"data-status": status,
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
						status:
							dom.getAttribute("data-status") !== undefined
								? dom.getAttribute("data-status")
								: "not started",
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
