import { Node } from "tiptap"
import { replaceText } from "tiptap-commands"
import { Suggestions } from "tiptap-extensions"

export default class NodeTag extends Node {
	get name() {
		return "tag"
	}

	get defaultOptions() {
		return {
			matcher: {
				char: "#",
				allowSpaces: false,
				startOfLine: false,
			},
			mentionClass: "tag",
			suggestionClass: "suggestion",
		}
	}

	get schema() {
		return {
			attrs: {
				id: {},
				label: {},
			},
			group: "inline",
			inline: true,
			selectable: false,
			atom: true,
			toDOM: (node) => [
				"span",
				{
					class: this.options.mentionClass,
					"data-type": this.name,
				},
				`${this.options.matcher.char}${node.attrs.label}`,
			],
			parseDOM: [
				{
					priority: 51,
					tag: `[data-type="${this.name}"]`,
					getAttrs: (dom) => {
						const label = dom.innerText.split(this.options.matcher.char).join("")
						return { label }
					},
				},
			],
		}
	}

	commands({ schema }) {
		return (attrs) => replaceText(null, schema.nodes[this.name], attrs)
	}

	get plugins() {
		return [
			Suggestions({
				command: ({ range, attrs, schema }) =>
					replaceText(range, schema.nodes[this.name], attrs),
				appendText: " ",
				matcher: this.options.matcher,
				items: this.options.items,
				onEnter: this.options.onEnter,
				onChange: this.options.onChange,
				onExit: this.options.onExit,
				onKeyDown: this.options.onKeyDown,
				onFilter: this.options.onFilter,
				suggestionClass: this.options.suggestionClass,
			}),
		]
	}
}
