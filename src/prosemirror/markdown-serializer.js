import { defaultMarkdownSerializer, MarkdownSerializer } from "prosemirror-markdown"

const nodes = defaultMarkdownSerializer.nodes
const marks = defaultMarkdownSerializer.marks

nodes.todo_item = function(state, node) {
	const value = node.attrs.status === "done" ? "x" : " "
	console.log("value", value, node.attrs)
	state.write(`- [${value}] `)
	state.renderInline(node)
	state.closeBlock(node)
}

nodes.todo_list = function(state, node) {
	state.renderInline(node)
	state.closeBlock(node)
}

export const markdownSerializer = new MarkdownSerializer(nodes, marks)
