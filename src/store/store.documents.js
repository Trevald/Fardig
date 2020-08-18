import Vue from "vue"
import Document from "./Document"

import { getPreferencesProp, updatePreferencesProp } from "./../utils/preferences"

import {
	documentGetJsonFromMarkdown,
	documentGetTagsLabels,
	documentHasTodos,
} from "./../utils/document"

const storeDocuments = {
	state: () => {
		return {
			documents: [],
			activeDocumentId: getPreferencesProp("activeDocumentId"),
			openDocumentsIds: getPreferencesProp("openDocumentIds", []),
		}
	},

	getters: {
		activeDocument: (state) => {
			return state.documents.find((document) => document.id === state.activeDocumentId)
		},

		activeDocumentId: (state) => {
			return state.activeDocumentId
		},

		allDocuments: (state) => {
			return state.documents
		},

		documentsWithTodos: (state) => {
			const res = state.documents.filter((doc) => documentHasTodos(doc) === true)
			return res
		},

		firstDocument: (state) => {
			return state.documents[0]
		},

		getDocumentById: (state) => (id) => {
			return state.documents.find((document) => document.id === id)
		},

		openDocuments: (state, getters) => {
			// Make sure we sort by index of openDocumentIds
			return state.openDocumentsIds
				.map((id) => {
					return getters.getDocumentById(id)
				})
				.filter((document) => {
					return document !== undefined
				})
		},

		tags: (state) => {
			let tags = []
			state.documents.forEach((doc) => {
				tags = tags.concat(documentGetTagsLabels(doc))
			})

			return tags
		},
	},

	mutations: {
		addDocument(state, payload) {
			const document = new Document(payload)
			state.documents.push(document)
		},

		setActiveDocument(state, payload) {
			this.commit("openDocument", payload)
			state.activeDocumentId = payload.id

			updatePreferencesProp("activeDocumentId", payload.id)
		},

		openDocument(state, payload) {
			const id = payload.id
			if (!state.openDocumentsIds.includes(id)) {
				state.openDocumentsIds.unshift(payload.id)
				if (state.openDocumentsIds.length > 3) {
					state.openDocumentsIds.length = 3 // .splice(0, state.openDocumentsIds.length - 3)
				}

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

	actions: {
		newDocument({ commit }) {
			return new Promise((resolve) => {
				const newDocument = {
					id: `temp-${Date.now()}`,
					json: documentGetJsonFromMarkdown("# My new file\n"),
				}
				commit("addDocument", newDocument)
				commit("setActiveDocument", newDocument)
				resolve(newDocument)
			})
		},
	},
}

export default storeDocuments
