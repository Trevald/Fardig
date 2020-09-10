import { documentGetFirstLine } from "./../utils/document"

export default class Document {
	constructor(data) {
		this.id = data?.id
		this._name = data?.name
		this.rev = data?.rev
		this.unsavedChanges = data?.unsavedChanges
		this.isUploading = data?.isUploading
		this.lastChanged = data?.lastChanged ? data.lastChanged : 0
		this.lastUpdated = data?.lastUpdated ? data.lastUpdated : 0
		this.json = data?.json
	}

	get isLoaded() {
		return this.json !== undefined
	}

	get name() {
		if (this._name && this._name !== "") {
			return this._name
		}
		let firstTextLine = documentGetFirstLine(this)

		if (firstTextLine === "") {
			return "Untitled.txt"
		}

		// firstTextLine = textLines[0].replace("#", "").replace(/(<([^>]+)>)/gi, "")
		firstTextLine = firstTextLine.length > 32 ? firstTextLine.substring(0, 32) : firstTextLine

		return `${firstTextLine}.txt`
	}
}
