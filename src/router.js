import VueRouter from "vue-router";
import { getPreferencesProp } from "./utils/preferences";

// Routes
import AppAuth from "./components/AppAuth";
import AppFrontPage from "./components/AppFrontPage";
// import AppLogin from "./components/AppLogin"
import AppMyTodos from "./components/AppMyTodos";
import AppDocument from "./components/AppDocument";
import AppTestPage from "./components/AppTestPage";

const routes = [
    {
        name: "Todos",
        path: "/todos/",
        component: AppMyTodos,
    },
    {
        name: "Document",
        path: "/doc/:documentId?",
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
        component: AppFrontPage,
    },
    {
        name: "Test",
        path: "/test",
        component: AppTestPage,
    },
];

export const router = new VueRouter({
    mode: process.env.IS_ELECTRON ? "hash" : "history",
    routes,
});

router.beforeEach((to, from, next) => {
    const accessToken = getPreferencesProp("accessToken");
    if (to.name !== "Login" && to.name !== "Auth" && !accessToken) {
        next({ name: "Login" });
    } else {
        next();
    }
});
