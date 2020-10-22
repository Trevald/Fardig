<template>
    <div id="app">
        <div class="view-col">
            <AppHeader v-if="loggedIn" />

            <main class="app-main">
                <div
                    class="container"
                    style="display: flex; min-height: min-content"
                >
                    <div class="view">
                        <router-view></router-view>
                    </div>
                </div>
            </main>
            <AppStatus v-if="loggedIn" class="app-status" />
            <transition name="fade">
                <AppCommand v-if="commandIsVisible && loggedIn" />
            </transition>
        </div>
        <notifications group="main" classes="unity-notification" />
    </div>
</template>

<script>
import AppCommand from "./components/AppCommand";
import AppHeader from "./components/AppHeader";
import AppStatus from "./components/AppStatus";

// App Plugins
import AppPresentation from "./app-plugins/presentation/index";

export default {
    name: "App",

    components: {
        AppCommand,
        AppHeader,
        AppStatus,
    },

    computed: {
        appReady() {
            return (
                !this.loggedIn ||
                (this.loggedIn &&
                    this.numberOfFilesLoaded >= this.totalNumberOfFiles)
            );
        },

        appReadyAndLoggedIn() {
            return (
                this.loggedIn &&
                this.numberOfFilesLoaded >= this.totalNumberOfFiles
            );
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
