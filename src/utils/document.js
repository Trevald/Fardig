export function documentGetBlob(doc) {
	return new Blob([doc.contents], { type: "text/plain" })
}

export function documentGetPath(doc) {
	return `/${doc.name}`
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
	let firstTextLine = textLines[0]
		.replace("#", "")
		.replace(/(<([^>]+)>)/gi, "")
	firstTextLine =
		firstTextLine.length > 32
			? firstTextLine.substring(0, 32)
			: firstTextLine

	return `${firstTextLine}.txt`
}

export function documentGetTitle(doc) {
	return doc.name.endsWith(".txt") ? doc.name.replace(".txt", "") : doc.name
}

export function documentGetCommitMode(doc) {
	return doc.rev === undefined ? doc.commitModeAdd : doc.commitModeUpdate
}

export function documentHasTodos(doc) {
	return doc.json.some((node) => node.type === "app_todo")
}
