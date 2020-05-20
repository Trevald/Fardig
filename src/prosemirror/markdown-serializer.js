import { defaultMarkdownSerializer, MarkdownSerializer } from "prosemirror-markdown"

const nodes = defaultMarkdownSerializer.nodes
const marks = defaultMarkdownSerializer.marks

nodes.app_todo = function(state, node) {
	state.renderInline(node)
	state.closeBlock(node)
}

export const markdownSerializer = new MarkdownSerializer(nodes, marks)
