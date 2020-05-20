import { EditorState } from "prosemirror-state"
import { Node } from "prosemirror-model"

import { markdownSerializer } from "./prosemirror/markdown-serializer"
import { schema } from "./utils/schema"

import { documentGetCommitMode, documentGetPath } from "./utils/document"

export function documentUpload(doc) {
	const fileToUpload = doc
	const fileToUploadState = EditorState.create({
		doc: Node.fromJSON(schema, fileToUpload.json),
	})
	const fileToUploadSerializedState = markdownSerializer.serialize(fileToUploadState.doc)

	const filesCommitInfo = {
		contents: new Blob([fileToUploadSerializedState], { type: "text/plain" }),
		autorename: false,
		mode: documentGetCommitMode(fileToUpload),
		path: documentGetPath(fileToUpload),
	}
	console.log("filesCommitInfo", filesCommitInfo, fileToUpload)

	this.$store.commit("updateDocument", {
		id: fileToUpload.id,
		isUploading: true,
		lastUpdated: fileToUpload.lastChanged,
	})

	this.cloudStorage.storeContents(filesCommitInfo).then(() => {
		this.$store.commit("updateDocument", {
			id: fileToUpload.id,
			isUploading: false,
		})
	})
}
