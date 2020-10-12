import { EditorState } from "prosemirror-state"
import { Node } from "prosemirror-model"

import { markdownParser } from "./../prosemirror/markdown-parser"
import { markdownSerializer } from "./../prosemirror/markdown-serializer"
import { schema } from "./../prosemirror/schema"

export function documentGetBlob(doc) {
	return new Blob([doc.contents], { type: "text/plain" })
}

export function documentGetPath(doc) {
	return `/${documentGetName(doc)}`
}

export function documentGetCommitMode(doc) {
	return doc.rev === undefined ? documentGetCommitModeAdd(doc) : documentCommitModeUpdate(doc)
}

function documentGetCommitModeAdd() {
	return "add"
}

function documentCommitModeUpdate(doc) {
	return {
		".tag": "update",
		update: doc.rev,
	}
}

export function documentGetName(doc) {
	if (doc._name && doc._name !== "") {
		return doc._name
	}
	let firstTextLine = documentGetFirstLine(doc)

	if (firstTextLine === "") {
		return "Untitled.txt"
	}

	// firstTextLine = textLines[0].replace("#", "").replace(/(<([^>]+)>)/gi, "")
	firstTextLine = firstTextLine.length > 32 ? firstTextLine.substring(0, 32) : firstTextLine

	return `${firstTextLine}.txt`
}

export function documentGetFirstLine(doc) {
	if (doc.json === undefined) {
		return ""
	}
	const node = Node.fromJSON(schema, doc.json)
	let firstLine = ""

	node.descendants((descendant) => {
		if (descendant.text && firstLine === "") {
			firstLine = descendant.text
		}
	})

	return firstLine
}

export function documentGetTitle(doc) {
	const name = documentGetName(doc)
	return name.endsWith(".txt") ? name.replace(".txt", "") : name
}

export function documentGetTodos(doc) {
	return getNodesByName(doc, "todo_item")
}

export function documentGetTodoLists(doc) {
	return getNodesByName(doc, "todo_list")
}

export function documentGetTags(doc) {
	return getNodesByName(doc, "tag")
}

function getNodesByName(doc, nodeName) {
	if (doc.json === undefined) {
		return []
	}
	const node = Node.fromJSON(schema, doc.json)
	const result = []

	node.descendants((descendant) => {
		if (descendant.type.name === nodeName) {
			result.push(descendant)
		}
	})

	return result
}

export function documentGetTagsLabels(doc) {
	const tags = documentGetTags(doc)
	const tagLabels = tags.map((tag) => tag.attrs.label)

	return tagLabels
}

export function documentHasTodos(doc) {
	return documentHasNodeType(doc, "todo_item")
}

export function documentHasTags(doc) {
	return documentHasNodeType(doc, "tag")
}

function documentHasNodeType(doc, nodeName) {
	if (doc.json === undefined) {
		return false
	}
	const node = Node.fromJSON(schema, doc.json)
	let result = false

	node.descendants((descendant) => {
		if (result === true) {
			return false
		}
		result = descendant.type.name === nodeName
	})

	return result
}

export function documentHasNotDoneTodos(doc) { 
    return documentHasNodeTypeWithAttrValue(doc, "todo_item", "status", "done", "NOT EQUAL") 
}

function documentHasNodeTypeWithAttrValue(doc, nodeName, fieldKey, fieldValue, operator = "EQUAL") {
	if (doc.json === undefined) {
		return false
	}
	const node = Node.fromJSON(schema, doc.json)
	let result = false

    node.descendants((descendant) => {
        
        // Break loop if we already have a hit
		if (result === true) {
			return false
        }
        
        // Check for node type
        if (descendant.type.name === nodeName) {
            
            // Check value of attr
            result = compareByOperator[operator](descendant.attrs[fieldKey], fieldValue) 
        }
	})

	return result
}

const compareByOperator = {
    "EQUAL": function (a, b) { return a === b },
    "NOT EQUAL": function (a, b) {  return a !== b } 
}

export function documentGetCommitInfo(doc) {
	const docState = EditorState.create({
		doc: Node.fromJSON(schema, doc.json),
	})

	const docStateSerialized = markdownSerializer.serialize(docState.doc)

	return {
		contents: new Blob([docStateSerialized], { type: "text/plain" }),
		autorename: true,
		mode: documentGetCommitMode(doc),
		path: documentGetPath(doc),
	}
}

export function documentGetJsonFromMarkdown(markdown) {
	return JSON.parse(JSON.stringify(markdownParser.parse(markdown)))
}
