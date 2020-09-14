import markdownit from "markdown-it"
const taskLists = require("./markdown-it-todo-item")
const tag = require("./markdown-it-tag")

import { MarkdownParser } from "prosemirror-markdown"
import { schema } from "./schema"

export const markdownParser = new MarkdownParser(
	schema,
	markdownit("commonmark", { html: false, breaks: false })
		.use(taskLists)
		.use(tag),
	{
		blockquote: { block: "blockquote" },
		paragraph: { block: "paragraph" },
		list_item: { block: "list_item" },
		bullet_list: { block: "bullet_list" },
		ordered_list: {
			block: "ordered_list",
			getAttrs: (tok) => ({
				order: +tok.attrGet("start") || 1,
			}),
		},
		heading: {
			block: "heading",
			getAttrs: (tok) => ({
				level: +tok.tag.slice(1),
			}),
		},
		code_block: { block: "code_block" },
		fence: {
			block: "code_block",
			getAttrs: (tok) => ({ params: tok.info || "" }),
		},
		hr: { node: "horizontal_rule" },
		image: {
			node: "image",
			getAttrs: (tok) => ({
				src: tok.attrGet("src"),
				title: tok.attrGet("title") || null,
				alt: (tok.children[0] && tok.children[0].content) || null,
			}),
		},
		hardbreak: { node: "hard_break" },

		todo_list: {
			block: "todo_list",
			node: "todo_list",
			getAttrs: (tok) => ({
				type: tok.attrGet("type"),
			}),
		},
		todo_item: {
			block: "todo_item",
			node: "todo_item",
			getAttrs: (tok) => ({
				id: tok.attrGet("data-id"),
				type: tok.attrGet("data-type"),
				status: tok.attrGet("data-status"),
			}),
		},
		tag: {
			node: "tag",
			getAttrs: (tok) => ({
				type: tok.attrGet("data-type"),
				id: tok.attrGet("data-id"),
				label: tok.attrGet("data-label"),
			}),
		},

		em: { mark: "em" },
		strong: { mark: "strong" },
		link: {
			mark: "link",
			getAttrs: (tok) => ({
				href: tok.attrGet("href"),
				title: tok.attrGet("title") || null,
			}),
		},
		code_inline: { mark: "code" },
	}
)
