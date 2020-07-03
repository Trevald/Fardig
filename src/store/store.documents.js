import Vue from "vue"
import Document from "./Document"

import { getPreferencesProp, updatePreferencesProp } from "./../utils/preferences"

import { documentGetJsonFromMarkdown, documentHasTodos } from "./../utils/document"

const storeDocuments = {
	state: () => {
		return {
			documents: [],
			activeDocumentId: getPreferencesProp("activeDocumentId"),
			openDocumentsIds: getPreferencesProp("openDocumentIds", []),
		}
	},

	getters: {
		allDocuments: (state) => {
			return state.documents
		},

		documentsWithTodos: (state) => {
			const res = state.documents.filter((doc) => documentHasTodos(doc) === true)
			console.log("res", res)
			return res
		},

		firstDocument: (state) => {
			return state.documents[0]
		},

		getDocumentById: (state) => (id) => {
			return state.documents.find((document) => document.id === id)
		},

		openDocuments: (state) => {
			return state.documents.filter((document) => {
				return state.openDocumentsIds.includes(document.id)
			})
		},

		activeDocument: (state) => {
			return state.documents.find((document) => document.id === state.activeDocumentId)
		},

		activeDocumentId: (state) => {
			return state.activeDocumentId
		},
	},

	mutations: {
		addDocument(state, payload) {
			const document = new Document(payload)
			state.documents.push(document)
		},

		newDocument() {
			const newDocument = {
				id: `temp-${Date.now()}`,
				json: documentGetJsonFromMarkdown("# My new file\n"),
				// contents: "<h1>My new file</h1>",
			}
			this.commit("addDocument", newDocument)
			this.commit("setActiveDocument", newDocument)
		},

		setActiveDocument(state, payload) {
			this.commit("openDocument", payload)
			state.activeDocumentId = payload.id

			updatePreferencesProp("activeDocumentId", payload.id)
		},

		openDocument(state, payload) {
			const id = payload.id
			if (!state.openDocumentsIds.includes(id)) {
				state.openDocumentsIds.push(payload.id)

				updatePreferencesProp("openDocumentIds", state.openDocumentsIds)
			}
		},

		updateDocument(state, payload) {
			const document = this.getters.getDocumentById(payload.id)
			for (let prop in payload) {
				if (Object.prototype.hasOwnProperty.call(payload, prop)) {
					Vue.set(document, prop, payload[prop])
				}
			}
		},
	},

	actions: {},
}

export default storeDocuments
