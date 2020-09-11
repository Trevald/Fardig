import { defaultMarkdownSerializer, MarkdownSerializer } from "prosemirror-markdown"

const nodes = defaultMarkdownSerializer.nodes
const marks = defaultMarkdownSerializer.marks

// marks.italic = { open: "*", close: "*", mixable: true, expelEnclosingWhitespace: true }
// marks.bold = { open: "**", close: "**", mixable: true, expelEnclosingWhitespace: true }

nodes.todo_item = function(state, node) {
	const value = node.attrs.status === "done" ? "x" : " "
	state.write(`- [${value}] `)
	state.renderInline(node)
	state.closeBlock(node)
}

nodes.todo_list = function(state, node) {
	state.renderInline(node)
	state.closeBlock(node)
}

nodes.tag = function(state, node) {
	console.log(state, node)
	const value = node.attrs.label
	state.write(`#${value}`)
	state.renderInline(node)
	state.closeBlock(node)
}

export const markdownSerializer = new MarkdownSerializer(nodes, marks)
