export default class Document {
	constructor(data) {
		this.id = data?.id
		this._name = data?.name
		this.rev = data?.rev
		this.unsavedChanges = data?.unsavedChanges
		this.isUploading = data?.isUploading
		this.lastChanged = data.lastChanged ? data.lastChanged : 0
		this.lastUpdated = data.lastUpdated ? data.lastUpdated : 0

		this.hasTodos = data?.hasTodos
		this.tags = data?.tags

		this.contents = data.contents
		this.json = data.json
	}

	get blob() {
		return new Blob([this.contents], { type: "text/plain" })
	}

	get path() {
		return `/${this.name}`
	}

	get hasTags() {
		return this.tags !== undefined && this.tags.length > 0
	}

	get commitModeAdd() {
		return "add"
	}

	get commitModeUpdate() {
		return {
			".tag": "update",
			update: this.rev,
		}
	}

	get name() {
		if (this._name && this._name !== "") {
			return this._name
		}
		const textLines = this.contents.split("\n")
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

	get title() {
		return this.name.endsWith(".txt")
			? this.name.replace(".txt", "")
			: this.name
	}

	getCommitMode() {
		return this.rev === undefined
			? this.commitModeAdd
			: this.commitModeUpdate
	}

	hasTodos() {
		return this.json.includes((node) => node.type === "app_todo")
	}
}
