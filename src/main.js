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

// Routes
import AppAuth from "./components/AppAuth"
import AppLogin from "./components/AppLogin"
import AppMyTodos from "./components/AppMyTodos"
import AppDocument from "./components/AppDocument"

const routes = [
	{
		name: "Todos",
		path: "/todos",
		component: AppMyTodos,
	},
	{
		name: "Document",
		path: "/doc/:documentId",
		component: AppDocument,
	},
	{
		name: "Index",
		path: "/",
		redirect: { name: "Login" },
	},
	{
		name: "Auth",
		path: "/auth*",
		component: AppAuth,
	},
	{
		name: "Login",
		path: "/login",
		component: AppLogin,
	},
]

const router = new VueRouter({ mode: "history", routes })

router.beforeEach((to, from, next) => {
	console.log("beforeEach", to.name, from.name, store.getters.accessToken)
	if (to.name !== "Login" && to.name !== "Auth" && !store.getters.accessToken) {
		next({ name: "Login" })
	} else {
		next()
	}
})

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount("#app")
