
export default class DocumentHandler {

    constructor() {
        this.documents = new Array();
    }

    get(id) {
        return this.documents.find(document => {
            return document.id === id;
        });
    }

    getDocuments() {
        return this.documents;
    }

    add(data, contents) {
        this.documents.push(new Document(data, contents));
    }

    createNew() {
        this.documents.add({}, "");
    }
}

class Document {
    constructor(data, contents) {
        this.id = data?.id;
        this.name = data?.name;
        this.unsavedChanges = data?.unsavedChanges;
        this.isUploading = data?.isUploading;
        this.lastChanged = data.lastChanged ? data.lastChanged : 0;
        this.lastUpdated = data.lastUpdated ? data.lastUpdated : 0;

        this.contents = contents;
    }

    get blob() {
        return new Blob([this.contents], {type: 'text/plain'});
    }

    get path() {
        return `/${this.name}`;
    }

    getCommitInfo() {
        this.isUploading = true;
        this.lastUpdate = this.lastChanged;
        return  {
            contents: this.blob,
            autorename: false,
            mode: "overwrite",
            path: this.path
        }
    }
}