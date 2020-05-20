import { EditorState } from "prosemirror-state"
import { Node } from "prosemirror-model"

import { contains } from "prosemirror-utils"

import { markdownParser } from "./../prosemirror/markdown-parser"
import { markdownSerializer } from "./../prosemirror/markdown-serializer"
import { schemaAll } from "./../schema"

export function documentGetBlob(doc) {
	return new Blob([doc.contents], { type: "text/plain" })
}

export function documentGetPath(doc) {
	return `/${documentGetName(doc)}`
}

export function documentGetCommitModeAdd() {
	return "add"
}

export function documentCommitModeUpdate(doc) {
	return {
		".tag": "update",
		update: doc.rev,
	}
}

export function documentGetName(doc) {
	if (doc._name && doc._name !== "") {
		return doc._name
	}
	const textLines = doc.contents.split("\n")
	if (textLines.length <= 0) {
		return "Untitled.txt"
	}
	let firstTextLine = textLines[0].replace("#", "").replace(/(<([^>]+)>)/gi, "")
	firstTextLine = firstTextLine.length > 32 ? firstTextLine.substring(0, 32) : firstTextLine

	return `${firstTextLine}.txt`
}

export function documentGetTitle(doc) {
	const name = documentGetName(doc)
	return name.endsWith(".txt") ? name.replace(".txt", "") : name
}

export function documentGetCommitMode(doc) {
	return doc.rev === undefined ? documentGetCommitModeAdd(doc) : documentCommitModeUpdate(doc)
}

export function documentHasTodos(doc) {
	return contains(doc, schemaAll.nodes.app_node)
}

export function documentGetCommitInfo(doc) {
	const docState = EditorState.create({
		doc: Node.fromJSON(schemaAll, doc.json),
	})

	const docStateSerialized = markdownSerializer.serialize(docState.doc)

	return {
		contents: new Blob([docStateSerialized], { type: "text/plain" }),
		autorename: false,
		mode: documentGetCommitMode(doc),
		path: documentGetPath(doc),
	}
}

export function documentGetJsonFromMarkdown(markdown) {
	return JSON.parse(JSON.stringify(markdownParser.parse(markdown)))
}
