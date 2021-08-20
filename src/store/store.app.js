import { getPreferencesProp, updatePreferencesProp } from "./../utils/preferences";
import { deleteFromArray } from "./../utils/helpers";

const storeApp = {
    state: () => {
        return {
            activeView: getPreferencesProp("activeView", "editor"),
            commandIsVisible: false,
            darkMode: true,
            editorToolbarIsVisible: getPreferencesProp("editorToolbarIsVisible", true),
            disabledCommands: [],
            sidebarIsVisible: getPreferencesProp("sidebarIsVisible", false),
        };
    },

    getters: {
        activeView: (state) => {
            return state.activeView;
        },

        accessToken: (state) => {
            return state.accessToken;
        },

        commandIsVisible: (state) => {
            return state.commandIsVisible;
        },

        darkMode: (state) => {
            return state.darkMode;
        },

        editorToolbarIsVisible: (state) => {
            return state.editorToolbarIsVisible;
        },

        sidebarIsVisible: (state) => {
            return state.sidebarIsVisible;
        },

        isCommandDisabled: (state) => (name) => {
            return (
                state.disabledCommands.find((command) => command.name === name) !== undefined
            );
        },

        getDisabledCommandsByName: (state) => (name) => {
            return state.disabledCommands.filter((command) => command.name === name);
        },

        disabledCommands: (state) => {
            return state.disabledCommands;
        },
    },

    mutations: {
        addShortcut(state, payload) {
            state.shortcuts.push(payload);
        },

        setActiveView(state, payload) {
            state.activeView = payload.name;
            updatePreferencesProp("activeView", payload.name);
        },

        setAccessToken(state, payload) {
            state.accessToken = payload.accessToken;
        },

        toggleCommand(state) {
            state.commandIsVisible = !state.commandIsVisible;
        },

        toggleDarkMode(state, payload) {
            state.darkMode = payload;
        },

        toggleSidebar(state) {
            state.sidebarIsVisible = !state.sidebarIsVisible;
            updatePreferencesProp("sidebarIsVisible", state.sidebarIsVisible);
        },

        toggleEditorToolbar(state) {
            state.editorToolbarIsVisible = !state.editorToolbarIsVisible;
            updatePreferencesProp("editorToolbarIsVisible", state.editorToolbarIsVisible);
        },

        disableCommand(state, payload) {
            state.disabledCommands.push(payload);
        },

        enableCommand(state, payload) {
            state.disabledCommands = deleteFromArray(state.disabledCommands, payload, "key");
        },
    },

    actions: {
        login() {},

        toggleCommand({ commit }) {
            commit("toggleCommand");
        },

        toggleEditorToolbar({ commit }) {
            commit("toggleEditorToolbar");
        },

        toggleDarkMode({ commit }) {
            const htmlClassList = document.querySelector("html").classList;
            if (!htmlClassList.contains("theme-light")) {
                htmlClassList.add("theme-light");
                commit("toggleDarkMode", false);
            } else {
                htmlClassList.remove("theme-light");
                commit("toggleDarkMode", true);
            }
        },

        toggleSidebar({ commit }) {
            commit("toggleSidebar");
        },
    },
};

export default storeApp;
