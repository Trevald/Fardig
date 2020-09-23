import Vue from "vue"

import Vuex from "vuex"
Vue.use(Vuex)

import VueHotkey from "v-hotkey"
Vue.use(VueHotkey)

import VueRouter from "vue-router"
Vue.use(VueRouter)

import Notifications from "vue-notification"
Vue.use(Notifications)

import App from "./App.vue"
import { router } from "./router.js"

// CSS
import "./assets/main.css"
import "./assets/suggestions.css"

Vue.config.productionTip = false

// Stores
import storeApp from "./store/store.app"
import storeDocuments from "./store/store.documents"
import storeDropbox from "./store/store.dropbox"

const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== "production",
	modules: {
		storeApp,
		storeDocuments,
		storeDropbox,
	},
})

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount("#app")
