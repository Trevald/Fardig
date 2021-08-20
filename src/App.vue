<template>
    <div id="app" :class="appClassList">
        <AppHeader v-if="loggedIn" class="app-header" />
        <AppSidebar />
        <main class="app-main view">
            <div class="container view">
                <router-view></router-view>
            </div>
        </main>
        <AppStatus v-if="loggedIn" class="app-status" />
        <transition name="fade">
            <AppCommand v-if="commandIsVisible && loggedIn" />
        </transition>

        <notifications group="main" classes="unity-notification" />
        <AppConfirm></AppConfirm>
    </div>
</template>

<script>
import AppCommand from "./components/AppCommand";
import AppHeader from "./components/AppHeader";
import AppSidebar from "./components/AppSidebar";
import AppStatus from "./components/AppStatus";

// App Plugins
import AppPresentation from "./app-plugins/presentation/index";
import AppConfirm from "./components/AppConfirm.vue";

export default {
    name: "App",

    components: {
        AppCommand,
        AppConfirm,
        AppHeader,
        AppSidebar,
        AppStatus,
    },

    computed: {
        appClassList() {
            const classList = [];
            if (this.$store.getters.sidebarIsVisible === true) {
                classList.push("show-sidebar");
            }
            return classList;
        },
        appReady() {
            return (
                !this.loggedIn ||
                (this.loggedIn && this.numberOfFilesLoaded >= this.totalNumberOfFiles)
            );
        },

        appReadyAndLoggedIn() {
            return this.loggedIn && this.numberOfFilesLoaded >= this.totalNumberOfFiles;
        },

        activeView() {
            return this.$store.getters.activeView;
        },

        loggedIn() {
            return this.$store.getters.isAuthenticated;
        },

        commandIsVisible() {
            return this.$store.getters.commandIsVisible;
        },

        documents() {
            return this.$store.getters.allDocuments;
        },
    },

    methods: {
        login() {
            if (this.$store.getters.isAuthenticated) {
                this.$store.dispatch("fetchDocuments");
            }
        },

        setActiveView(view, file) {
            this.$store.commit("setActiveView", { name: view });

            if (file) {
                this.$store.commit("setActiveDocument", { id: file.id });
            }
        },
    },

    mounted() {
        this.login();
    },

    created() {
        // Plugins
        AppPresentation.install({ genie: this.$genie, router: this.$router });
    },
};
</script>

<style scoped>
.app-progress {
    position: fixed;
    top: 50%;
    left: 50%;

    transform: translate(-50%, -50%);
}
</style>
