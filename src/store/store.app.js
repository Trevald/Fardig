import { getPreferencesProp, updatePreferencesProp } from "./../utils/preferences"

const storeApp = {
	state: () => {
		return {
			activeView: getPreferencesProp("activeView", "editor"),
			accessToken: undefined,
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
	},

	mutations: {
		setActiveView(state, payload) {
			state.activeView = payload.name
			updatePreferencesProp("activeView", payload.name)
		},

		setAccessToken(state, payload) {
			state.accessToken = payload.accessToken
		},
	},

	actions: {},
}

export default storeApp
