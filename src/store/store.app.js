import { getPreferencesProp, updatePreferencesProp } from "./../utils/preferences"

const storeApp = {
	state: () => {
		return {
			activeView: getPreferencesProp("activeView", "editor"),
			accessToken: getAccessToken(),
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

function getAccessToken() {
	const accessToken = getPreferencesProp("accessToken")
	return accessToken
}

export default storeApp
