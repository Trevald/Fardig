import VueRouter from "vue-router"
import { getPreferencesProp } from "./utils/preferences"

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
		name: "Todos",
		path: "/todos/:filter",
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
		redirect: { name: "Document" },
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

export const router = new VueRouter({ mode: "history", routes })

router.beforeEach((to, from, next) => {
	const accessToken = getPreferencesProp("accessToken")
	if (to.name !== "Login" && to.name !== "Auth" && !accessToken) {
		next({ name: "Login" })
	} else {
		next()
	}
})
