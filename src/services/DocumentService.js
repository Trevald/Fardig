
export default class DocumentHandler {

    constructor() {
        this.documents = new Array();
    }

    get(id) {
        return this.documents.find(document => {
            return document.id === id;
        });
    }

    getFirst() {
        return this.documents[0]
    }

    getAll() {
        return this.documents;
    }

    getDocuments() {
        return this.documents;
    }

    add(data, contents) {
        const document = new Document(data, contents);
        this.documents.push(document);

        return document;
    }

    createNew() {
        return this.add({
            id: `temp-${Date.now()}`,
        }, "<h1>My new file</h1>");
    }
}

class Document {
    constructor(data, contents) {
        this.id = data?.id
        this._name = data?.name
        this.rev = data?.rev
        this.unsavedChanges = data?.unsavedChanges
        this.isUploading = data?.isUploading
        this.lastChanged = data.lastChanged ? data.lastChanged : 0
        this.lastUpdated = data.lastUpdated ? data.lastUpdated : 0
        
        this.hasTodos = data?.hasTodos
        this.tags = data?.tags

        this.contents = contents;
    }

    get blob() {
        return new Blob([this.contents], {type: 'text/plain'});
    }

    get path() {
        return `/${this.name}`;
    }

    get hasTags() {
        return this.tags !== undefined && this.tags.length > 0
    }

    get commitModeAdd() {
        return "add";
    }

    get commitModeUpdate() {
        return {
            ".tag": "update",
            "update": this.rev            
        }
    }

    get name() {
        if (this._name && this._name !== "") { return this._name; }
        const textLines = this.contents.split("\n")
        if (textLines.length <= 0) { return "Untitled.txt" }
        let firstTextLine = textLines[0].replace("#", "").replace(/(<([^>]+)>)/ig,"")
        firstTextLine = firstTextLine.length > 32 ? firstTextLine.substring(0, 32) : firstTextLine

        return `${firstTextLine}.txt`
    }

    get title() {
        return this.name.endsWith(".txt") ? this.name.replace(".txt", "") : this.name
    }

    getCommitInfo() {
        this.isUploading = true;
        this.lastUpdate = this.lastChanged;

        return  {
            contents: this.blob,
            autorename: false,
            mode: this.getCommitMode(),
            path: this.path
        }
    }

    getCommitMode() {
        return this.rev === undefined ? this.commitModeAdd : this.commitModeUpdate;
    }
}