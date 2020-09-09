import Vue from "vue"
import Vuex from "vuex"
import App from "./App.vue"
import VueHotkey from "v-hotkey"
import VueRouter from "vue-router"

// CSS
import "./assets/main.css"
import "./assets/suggestions.css"

Vue.use(Vuex)
Vue.use(VueHotkey)
Vue.use(VueRouter)
Vue.config.productionTip = false

import { router } from "./router.js"

// Stores
import storeApp from "./store/store.app"
import storeDocuments from "./store/store.documents"

const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== "production",
	modules: {
		storeApp,
		storeDocuments,
	},
})

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount("#app")
