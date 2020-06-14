import { getPreferencesProp, updatePreferencesProp } from "./../utils/preferences"

const storeApp = {
	state: () => {
		return {
			activeView: getPreferencesProp("activeView", "editor"),
		}
	},

	getters: {
		activeView: (state) => {
			return state.activeView
		},
	},

	mutations: {
		setActiveView(state, payload) {
			state.activeView = payload.name
			updatePreferencesProp("activeView", payload.name)
		},
	},

	actions: {},
}

export default storeApp
