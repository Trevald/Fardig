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
}
