import Vue from "vue"
import Document from "./Document"
import { router } from "./../router"

import { getPreferencesProp, updatePreferencesProp } from "./../utils/preferences"
import { documentGetCommitInfo } from "./../utils/document"

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

		documentsLoading: (state) => {
			return state.documents.filter((doc) => doc.isLoaded !== true)
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

			return [...new Set(tags)]
		},

		unsavedDocuments: (state) => {
			return state.documents.filter((doc) => {
				return doc.lastUpdated < doc.lastChanged
			})
		},

		hasUnsavedDocuments: (state, getters) => {
			return getters.unsavedDocuments.length > 0
		},

		uploadingDocuments: (state) => {
			return state.documents.filter((doc) => {
				return doc.isUploading === true
			})
		},

		documentsAreUploading: (state, getters) => {
			return getters.uploadingDocuments.length > 0
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
		async fetchDocuments({ dispatch, commit, rootState }) {
			console.log("fetchDocuments", rootState)
			const files = await dispatch("getEntries")
			files.forEach((file) => {
				commit("addDocument", file)
				dispatch("fetchDocument", file)
			})
		},

		async fetchDocument({ commit, dispatch }, file) {
			const fileContent = await dispatch("getContents", file.path_lower)

			file.json = documentGetJsonFromMarkdown(fileContent)
			commit("updateDocument", { id: file.id, json: file.json })
		},

		newDocument({ commit }) {
			const newDocument = {
				id: `temp-${Date.now()}`,
				json: documentGetJsonFromMarkdown("# My new file\n"),
			}
			commit("addDocument", newDocument)
			commit("setActiveDocument", newDocument)
			router.push({
				name: "Document",
				params: { documentId: newDocument.id },
			})
		},

		async uploadDocument(doc) {
			const filesCommitInfo = documentGetCommitInfo(doc)

			this.$store.commit("updateDocument", {
				id: doc.id,
				isUploading: true,
				lastUpdated: doc.lastChanged,
			})

			this.cloudStorage.storeContents(filesCommitInfo).then((newDoc) => {
				if (newDoc.id !== doc.id) {
					this.$router.replace({
						name: "Document",
						params: { documentId: newDoc.id },
					})
				}
				this.$store.commit("updateDocument", {
					id: doc.id,
					rev: newDoc.rev,
					isUploading: false,
				})
			})
		},

		uploadDocuments() {},

		saveDocument() {},
	},
}

export default storeDocuments
