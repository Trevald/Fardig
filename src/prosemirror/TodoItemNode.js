import { Node } from "tiptap"
import { sinkListItem, splitToDefaultListItem, liftListItem } from "tiptap-commands"
import { generateID } from "../utils/helpers"

import AppTodo from "./../components/AppTodoItem"

export default class TodoItem extends Node {
	get name() {
		return "todo_item"
	}

	get defaultOptions() {
		return {
			nested: true,
			todoList: false,
		}
	}

	get view() {
		return AppTodo
	}

	getId() {
		return generateID()
	}

	get schema() {
		return {
			attrs: {
				status: {
					default: "not started",
				},
				id: {
					default: undefined,
				},
			},
			group: "block",
			draggable: true,
			content: this.options.nested ? "(paragraph|todo_list)+" : "paragraph+",
			toDOM: (node) => {
				const { id, status } = node.attrs
				return [
					"li",
					{
						"data-type": this.name,
						"data-status": status,
						"data-id": id || generateID(),
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
						id: dom.getAttribute("data-id"),
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
