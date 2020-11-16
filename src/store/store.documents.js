import Vue from "vue";
import Document from "./Document";
import { router } from "./../router";

import {
    getPreferencesProp,
    updatePreferencesProp,
} from "./../utils/preferences";

import {
    documentGetCommitInfo,
    documentGetJsonFromMarkdown,
    documentGetTagsLabels,
    documentHasTodos,
    documentHasNotDoneTodos,
} from "./../utils/document";

const storeDocuments = {
    state: () => {
        return {
            documents: [],
            activeDocumentId: getPreferencesProp("activeDocumentId"),
            openDocumentsIds: getPreferencesProp("openDocumentIds", []),
        };
    },

    getters: {
        activeDocument: (state) => {
            return state.documents.find(
                (document) => document.id === state.activeDocumentId
            );
        },

        activeDocumentId: (state) => {
            return state.activeDocumentId;
        },

        allDocuments: (state) => {
            return state.documents;
        },

        documentsLoaded: (state) => {
            return state.documents.filter((doc) => doc.isLoaded === true);
        },

        documentsWithTodos: (state) => {
            return state.documents.filter(
                (doc) => documentHasTodos(doc) === true
            );
        },

        documentsWithNotStartedTodos: (state) => {
            return state.documents.filter(
                (doc) => documentHasNotDoneTodos(doc) === true
            );
        },

        firstDocument: (state) => {
            return state.documents[0];
        },

        getDocumentById: (state) => (id) => {
            return state.documents.find((document) => document.id === id);
        },

        openDocuments: (state, getters) => {
            // Make sure we sort by index of openDocumentIds
            return state.openDocumentsIds
                .map((id) => {
                    return getters.getDocumentById(id);
                })
                .filter((document) => {
                    return document !== undefined;
                });
        },

        tags: (state) => {
            let tags = [];
            state.documents.forEach((doc) => {
                tags = tags.concat(documentGetTagsLabels(doc));
            });

            return [...new Set(tags)];
        },

        unsavedDocuments: (state) => {
            return state.documents.filter((doc) => {
                return doc.lastUpdated < doc.lastChanged;
            });
        },

        hasUnsavedDocuments: (state, getters) => {
            return getters.unsavedDocuments.length > 0;
        },

        uploadingDocuments: (state) => {
            return state.documents.filter((doc) => {
                return doc.isUploading === true;
            });
        },

        documentsAreUploading: (state, getters) => {
            return getters.uploadingDocuments.length > 0;
        },
    },

    mutations: {
        addDocument(state, payload) {
            const document = new Document(payload);
            state.documents.push(document);
        },

        setActiveDocument(state, payload) {
            this.commit("openDocument", payload);
            state.activeDocumentId = payload.id;

            updatePreferencesProp("activeDocumentId", payload.id);
        },

        openDocument(state, payload) {
            const id = payload.id;
            if (!state.openDocumentsIds.includes(id)) {
                state.openDocumentsIds.unshift(payload.id);
                if (state.openDocumentsIds.length > 5) {
                    state.openDocumentsIds.length = 5; // .splice(0, state.openDocumentsIds.length - 3)
                }

                updatePreferencesProp(
                    "openDocumentIds",
                    state.openDocumentsIds
                );
            }
        },

        closeDocument(state, payload) {
            const id = payload.id;
            if (state.openDocumentsIds.includes(id)) {
                const index = state.openDocumentsIds.indexOf(id);
                state.openDocumentsIds.splice(index, 1);

                updatePreferencesProp(
                    "openDocumentIds",
                    state.openDocumentsIds
                );

                if (state.activeDocumentId === id) {
                    const newActiveDocument =
                        this.getters.openDocuments.length > 0
                            ? this.getters.openDocuments[
                                  this.getters.openDocuments.length - 1
                              ]
                            : undefined;

                    this.commit("setActiveDocument", {
                        id: newActiveDocument?.id,
                    });

                    if (router.currentRoute.params.documentId === id) {
                        if (newActiveDocument !== undefined) {
                            router.push({
                                name: "Document",
                                params: { documentId: newActiveDocument.id },
                            });
                        } else {
                            router.push({
                                name: "Index",
                            });
                        }
                    }
                }
            }
        },

        documentDeleted(state, payload) {
            const documentIndex = state.documents.findIndex(
                (doc) => payload.id === doc.id
            );
            this.commit("closeDocument", payload);

            if (documentIndex) {
                state.documents.splice(documentIndex, 1);
            }
        },

        updateDocument(state, payload) {
            const document = this.getters.getDocumentById(payload.id);
            for (let prop in payload) {
                if (Object.prototype.hasOwnProperty.call(payload, prop)) {
                    Vue.set(document, prop, payload[prop]);
                }
            }
            this.commit("sortDocumentsByLastChanged");
        },

        updateDocumentId(state, payload) {
            const document = this.getters.getDocumentById(payload.id);
            document.id = payload.newId;
        },

        sortDocumentsByLastChanged(state) {
            state.documents.sort((a, b) => {
                return b.lastChanged - a.lastChanged;
            });
        },
    },

    actions: {
        async fetchDocuments({ dispatch, commit, getters }) {
            const files = await dispatch("getEntries");
            files.forEach((file) => {
                commit("addDocument", file);
            });

            commit("sortDocumentsByLastChanged");
            getters.allDocuments.forEach((doc) => {
                dispatch("fetchDocument", doc);
            });
        },

        async fetchDocument({ commit, dispatch }, file) {
            const fileContent = await dispatch("getContents", file.id);

            const json = documentGetJsonFromMarkdown(fileContent);
            // const removeMarkdownRegEx = /(#{1,6})|((\r\n|\r|\n)n#{1,6})|((\r\n|\r|\n)\*)|((\r\n|\r|\n)n\d*)|((\r\n|\r|\n)n)/gi;
            const text = fileContent; // .replace(removeMarkdownRegEx, "");

            commit("updateDocument", {
                id: file.id,
                json: json,
                text: text,
            });
        },

        async deleteDocument({ commit, dispatch }, file) {
            await dispatch("deleteFile", file);
            commit("documentDeleted", file);
        },

        newDocument({ commit }) {
            const newDocument = {
                id: `temp-${Date.now()}`,
                json: documentGetJsonFromMarkdown("# My new file\n"),
            };
            commit("addDocument", newDocument);
            commit("setActiveDocument", newDocument);
            router.push({
                name: "Document",
                params: { documentId: newDocument.id },
            });
        },

        async uploadDocument({ commit, dispatch, getters }, documentId) {
            const doc = getters.getDocumentById(documentId);
            const filesCommitInfo = documentGetCommitInfo(doc);

            commit("updateDocument", {
                id: doc.id,
                isUploading: true,
                lastUpdated: doc.lastChanged,
            });

            console.log(`UPLOAD START: ${doc.id}`);

            const response = await dispatch("storeContents", filesCommitInfo);
            const newDoc = response.result;
            commit("updateDocument", {
                id: doc.id,
                rev: newDoc.rev,
                isUploading: false,
            });

            console.log(`UPLOAD DONE: ${doc.id}`);

            if (newDoc.id !== doc.id) {
                const oldId = doc.id;
                commit("updateDocumentId", { id: doc.id, newId: newDoc.id });
                const currentRouteParams = router.currentRoute.params;
                if (currentRouteParams.documentId === oldId) {
                    router.replace({
                        name: "Document",
                        params: { documentId: newDoc.id },
                    });
                }
            }
        },

        uploadDocuments() {},

        saveAll({ dispatch, getters }) {
            if (getters.isCommandDisabled("saveDocument")) {
                Vue.notify({
                    group: "main",
                    type: "warning",
                    text: "Can't save while image is uploading",
                });
                return;
            }

            getters.unsavedDocuments.forEach((doc) => {
                dispatch("uploadDocument", doc.id);
            });
        },

        saveDocument({ dispatch, getters }) {
            if (getters.isCommandDisabled("saveDocument")) {
                Vue.notify({
                    group: "main",
                    type: "warning",
                    text: "Can't save while image is uploading",
                });
                return;
            }
            const documentId = router.currentRoute.params.documentId;
            const document = getters.getDocumentById(documentId);
            if (document !== undefined) {
                dispatch("uploadDocument", documentId);
            }
        },
    },
};

export default storeDocuments;
