import { getPreferencesProp, updatePreferencesProp } from "./../utils/preferences"

const storeApp = {
	state: () => {
		return {
			activeView: getPreferencesProp("activeView", "editor"),
			accessToken: getAccessToken(),
			commandIsVisible: false,
			darkMode: true,
		}
	},

	getters: {
		activeView: (state) => {
			return state.activeView
		},

		accessToken: (state) => {
			return state.accessToken
		},

		isAuthenticated: (state) => {
			return state.accessToken !== undefined
		},

		commandIsVisible: (state) => {
			return state.commandIsVisible
		},

		darkMode: (state) => {
			return state.darkMode
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
	},

	actions: {
		toggleCommand({ commit }) {
			commit("toggleCommand")
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

function getAccessToken() {
	const accessToken = getPreferencesProp("accessToken")
	return accessToken
}

export default storeApp
