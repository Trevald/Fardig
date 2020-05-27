import { defaultMarkdownSerializer, MarkdownSerializer } from "prosemirror-markdown"

const nodes = defaultMarkdownSerializer.nodes
const marks = defaultMarkdownSerializer.marks

nodes.todo_item = function(state, node) {
	state.renderInline(node)
	state.closeBlock(node)
}

export const markdownSerializer = new MarkdownSerializer(nodes, marks)
