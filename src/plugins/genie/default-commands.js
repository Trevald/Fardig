export default [
	{
		id: "TEST",
		description: "Test",
		hidden: true,
		shortcut: "meta+ctrl+y",
	},
	{
		id: "NEW_DOCUMENT",
		description: "Create new file",
		icon:
			'<path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z"></path>',
		shortcut: "ctrl+n",
		action: ({ store }) => {
			store.dispatch("newDocument")
		},
	},
	{
		id: "TOGGLE_COMMAND",
		description: "Toggle command palette",
		shortcut: "meta+p",
		action: ({ store }) => {
			store.dispatch("toggleCommand")
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
			store.dispatch("saveDocument")
		},
	},
	{
		id: "TOGGE_THEME_MODE",
		description: "Toggle dark/light mode",
		action: "toggleDarkMode",
		icon: {
			dark:
				'<path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"></path>',
			light:
				'<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>',
		},
	},
	{
		id: "TOGGLE_EDITOR_TOOLBAR",
		description: "Toggle toolbar",
		action: ({ store }) => {
			store.dispatch("toggleEditorToolbar")
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
	/*
	{
		id: "DELETE_FILE",
		description: "Delete current file",
		icon: "",
		disabled: true,
		keys: "meta+backspace",
		callback: (event) => {
			event.preventDefault()
		},
	},
	*/
]
