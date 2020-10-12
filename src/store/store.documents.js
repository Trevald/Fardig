import Vue from "vue"
import Document from "./Document"
import { router } from "./../router"

import { getPreferencesProp, updatePreferencesProp } from "./../utils/preferences"

import {
    documentGetCommitInfo,
	documentGetJsonFromMarkdown,
	documentGetTagsLabels,
    documentHasTodos,
    documentHasNotDoneTodos
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

		documentsLoaded: (state) => {
			return state.documents.filter((doc) => doc.isLoaded === true)
		},

		documentsWithTodos: (state) => {
			return state.documents.filter((doc) => documentHasTodos(doc) === true)
        },
        
		documentsWithNotStartedTodos: (state) => {
			return state.documents.filter((doc) => documentHasNotDoneTodos(doc) === true)
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

		updateDocumentId(state, payload) {
			const document = this.getters.getDocumentById(payload.id)
			document.id = payload.newId
		},
	},

	actions: {
		async fetchDocuments({ dispatch, commit }) {
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

		async uploadDocument({ commit, dispatch, getters }, documentId) {
			const doc = getters.getDocumentById(documentId)
			const filesCommitInfo = documentGetCommitInfo(doc)

			commit("updateDocument", {
				id: doc.id,
				isUploading: true,
				lastUpdated: doc.lastChanged,
			})
            
            console.log(`UPLOAD START: ${doc.id}`)
            
            const newDoc = await dispatch("storeContents", filesCommitInfo)
			commit("updateDocument", {
				id: doc.id,
				rev: newDoc.rev,
				isUploading: false,
            })

            console.log(`UPLOAD DONE: ${doc.id}`)

			if (newDoc.id !== doc.id) {
				commit("updateDocumentId", { id: doc.id, newId: newDoc.id })
				router.replace({
					name: "Document",
					params: { documentId: newDoc.id },
				})
			}
		},

        uploadDocuments() { },
        
        saveAll({ dispatch, getters }) {
			if (getters.isCommandDisabled("saveDocument")) {
				Vue.notify({
					group: "main",
					type: "warning",
					text: "Can't save while image is uploading",
				})
				return
            }

            getters.unsavedDocuments.forEach(doc => {
                dispatch("uploadDocument", doc.id)
            })
        },

		saveDocument({ dispatch, getters }) {
			if (getters.isCommandDisabled("saveDocument")) {
				Vue.notify({
					group: "main",
					type: "warning",
					text: "Can't save while image is uploading",
				})
				return
			}
			const documentId = router.currentRoute.params.documentId
			const document = getters.getDocumentById(documentId)
			if (document !== undefined) {
				dispatch("uploadDocument", documentId)
			}
		},
	},
}

export default storeDocuments
