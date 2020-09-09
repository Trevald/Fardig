export const commands = [
	{
		id: "NEW_FILE",
		description: "Create new file",
		icon:
			'<path d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>',
		shortcut: "ctrl+n",
		action: "newDocument",
	},
	{
		id: "TOGGLE_COMMAND",
		description: "Toggle command palette",
		shortcut: "meta+p",
		action: "toggleCommand",
		hidden: true,
	} /*
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
	{
		id: "TOGGLE_DARK_LIGHT_MODE",
		description: "Toggle dark/light mode",
		icon:
			'<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>',
		iconLightMode:
			'<path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>',
		callback: () => {
			const html = document.querySelector("html")
			html.classList.toggle("theme-light")
		},
	},*/,
]
