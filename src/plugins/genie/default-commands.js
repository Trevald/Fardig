export default [
    {
        id: "NEW_DOCUMENT",
        description: "Create new file",
        icon:
            '<path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z"></path>',
        shortcut: "ctrl+n",
        action: ({ store }) => {
            store.dispatch("newDocument");
        },
    },
    {
        id: "TOGGLE_COMMAND",
        description: "Toggle command palette",
        shortcut: "meta+p",
        action: ({ store }) => {
            store.dispatch("toggleCommand");
        },
        hidden: true,
    },
    {
        id: "SAVE_DOCUMENT",
        description: "Save current file",
        icon:
            '<path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>',
        shortcut: "meta+s",
        action: ({ store }) => {
            store.dispatch("saveDocument");
        },
    },
    {
        id: "SAVE_ALL",
        description: "Save all unsaved files",
        icon:
            '<path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>',
        shortcut: "meta+shift+s",
        action: ({ store }) => {
            store.dispatch("saveAll");
        },
    },
    {
        id: "TOGGE_THEME_MODE",
        description: "Toggle dark/light mode",
        action: ({ store }) => {
            store.dispatch("toggleDarkMode");
        },
        icon: {
            dark:
                '<path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"></path>',
            light:
                '<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>',
        },
    },
    {
        id: "TOGGLE_SIDEBAR",
        description: "Toggle sidebar",
        action: ({ store }) => {
            store.dispatch("toggleSidebar");
        },
        icon:
            '<path fill-rule="evenodd" clip-rule="evenodd" d="M2.29289 3.29289C2.10536 3.48043 2 3.73478 2 4V16C2 16.2652 2.10536 16.5196 2.29289 16.7071C2.48043 16.8946 2.73478 17 3 17H5C5.26522 17 5.51957 16.8946 5.70711 16.7071C5.89464 16.5196 6 16.2652 6 16V4C6 3.73478 5.89464 3.48043 5.70711 3.29289C5.51957 3.10536 5.26522 3 5 3H3C2.73478 3 2.48043 3.10536 2.29289 3.29289ZM8 4C8 3.73478 8.10536 3.48043 8.29289 3.29289C8.48043 3.10536 8.73478 3 9 3H17C17.2652 3 17.5196 3.10536 17.7071 3.29289C17.8946 3.48043 18 3.73478 18 4V16C18 16.2652 17.8946 16.5196 17.7071 16.7071C17.5196 16.8946 17.2652 17 17 17H9C8.73478 17 8.48043 16.8946 8.29289 16.7071C8.10536 16.5196 8 16.2652 8 16V4Z" />',
    },
    {
        id: "TOGGLE_EDITOR_TOOLBAR",
        description: "Toggle toolbar",
        action: ({ store }) => {
            store.dispatch("toggleEditorToolbar");
        },
        icon:
            '<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>',
    },

    /*
        {
        id: "LOGOUT",
        description: "Logout",
        action: "logout",
        icon: '<path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"></path>'
        }
        */

    {
        id: "DELETE_FILE",
        description: "Delete current file",
        icon:
            '<path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>',
        keys: "meta+shift+backspace",
        action: ({ router, store, Vue }) => {
            Vue.genieConfirm
                .confirm("Are you sure you want to delete this file?")
                .then((confirmed) => {
                    if (!confirmed) {
                        return;
                    }
                    const documentId = router.currentRoute.params.documentId;
                    const document = store.getters.getDocumentById(documentId);
                    store.dispatch("deleteDocument", document).then(() => {
                        Vue.notify({
                            group: "main",
                            type: "success",
                            text: "Deleted 1 file",
                        });
                    });
                });
        },
    },
];
