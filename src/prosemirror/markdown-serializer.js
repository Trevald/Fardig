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

nodes.image = function(state, node) {
	console.log("imageSerizllizer", node.attrs)
	state.write(
		"![" +
			state.esc(node.attrs.alt || "") +
			"](" +
			state.esc(node.attrs.path) +
			(node.attrs.title ? " " + state.quote(node.attrs.title) : "") +
			")"
	)
}

export const markdownSerializer = new MarkdownSerializer(nodes, marks)
