export function nodeIsBlockquote(node) {
	return node.type.name === "blockquote"
}

export function nodeIsHeading(node) {
	return node.type.name === "heading"
}

export function nodeIsH1(node) {
	return nodeIsHeading(node) && node.attrs.level === 1
}

export function nodeIsH2(node) {
	return nodeIsHeading(node) && node.attrs.level === 2
}

export function nodeIsH3(node) {
	return nodeIsHeading(node) && node.attrs.level === 3
}

export function nodeIsList(node) {
	return ["bullet_list", "ordered_list"].includes(node.type.name)
}

export function nodeIsParagraph(node) {
	return ["paragraph"].includes(node.type.name)
}
