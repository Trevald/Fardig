import { Node } from "tiptap"
import { sinkListItem, splitToDefaultListItem, liftListItem } from "tiptap-commands"
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
			content: this.options.nested ? "(paragraph|todo_list)+" : "paragraph+", // "inline*", //
			toDOM: (node) => {
				const { status } = node.attrs
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

	keys({ type }) {
		return {
			Enter: splitToDefaultListItem(type),
			Tab: this.options.nested ? sinkListItem(type) : () => {},
			"Shift-Tab": liftListItem(type),
		}
	}
}
