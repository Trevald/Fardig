import { getPreferencesProp, updatePreferencesProp } from "./../utils/preferences"

const storeApp = {
	state: () => {
		return {
			activeView: getPreferencesProp("activeView", "editor"),
			// accessToken: dropboxAccessToken,
			commandIsVisible: false,
			darkMode: true,
			editorToolbarIsVisible: getPreferencesProp("editorToolbarIsVisible", "editor"),
			// cloudStorage: new DropboxApi(dropboxAccessToken),
		}
	},

	getters: {
		activeView: (state) => {
			return state.activeView
		},

		accessToken: (state) => {
			return state.accessToken
		},

		commandIsVisible: (state) => {
			return state.commandIsVisible
		},

		darkMode: (state) => {
			return state.darkMode
		},

		editorToolbarIsVisible: (state) => {
			return state.editorToolbarIsVisible
		},
	},

	mutations: {
		addShortcut(state, payload) {
			state.shortcuts.push(payload)
		},

		setActiveView(state, payload) {
			state.activeView = payload.name
			updatePreferencesProp("activeView", payload.name)
		},

		setAccessToken(state, payload) {
			state.accessToken = payload.accessToken
		},

		toggleCommand(state) {
			state.commandIsVisible = !state.commandIsVisible
		},

		toggleDarkMode(state, payload) {
			state.darkMode = payload
		},

		toggleEditorToolbar(state) {
			state.editorToolbarIsVisible = !state.editorToolbarIsVisible
			updatePreferencesProp("editorToolbarIsVisible", state.editorToolbarIsVisible)
		},
	},

	actions: {
		login() {},

		toggleCommand({ commit }) {
			commit("toggleCommand")
		},

		toggleEditorToolbar({ commit }) {
			commit("toggleEditorToolbar")
		},

		toggleDarkMode({ commit }) {
			const htmlClassList = document.querySelector("html").classList
			if (!htmlClassList.contains("theme-light")) {
				htmlClassList.add("theme-light")
				commit("toggleDarkMode", false)
			} else {
				htmlClassList.remove("theme-light")
				commit("toggleDarkMode", true)
			}
		},
	},
}

export default storeApp
