import { getPreferencesProp, updatePreferencesProp } from "./../utils/preferences"

const storeApp = {
	state: () => {
		return {
			activeView: getPreferencesProp("activeView", "editor"),
			accessToken: getAccessToken(),
			commandIsVisible: false,
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
	},

	actions: {
		toggleCommand({ commit }) {
			commit("toggleCommand")
		},
	},
}

function getAccessToken() {
	const accessToken = getPreferencesProp("accessToken")
	return accessToken
}

export default storeApp
