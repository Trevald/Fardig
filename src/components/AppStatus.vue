<template>
    <div class="app-status">
        <ul class="no-style">
            <li>{{ saveState }}</li>
            <li>
                <transition name="fade">
                    <progress
                        v-if="numberOfFilesLoaded < totalNumberOfFiles"
                        :value="numberOfFilesLoaded"
                        :max="totalNumberOfFiles"
                        >{{ numberOfFilesLoaded }} /
                        {{ totalNumberOfFiles }}</progress
                    >
                </transition>
            </li>
        </ul>
        <ul class="no-style">
            <li>
                <button class="no-style" @click="toggleShortcuts">
                    Shortcuts
                </button>
            </li>
            <li>
                Fardig.io <small>{{ appVersion }}</small>
            </li>
        </ul>
        <transition name="fade">
            <AppShortcuts v-if="shortcutsAreVisisble" />
        </transition>
    </div>
</template>

<script>
import AppShortcuts from "./AppShortcuts";
let APP_VERSION;
export default {
    name: "AppStatus",

    components: {
        AppShortcuts,
    },

    data() {
        return {
            shortcutsAreVisisble: false,
        };
    },

    computed: {
        appVersion() {
            return process.env.APP_VERSION;
        },
        numberOfFilesLoaded() {
            return this.$store.getters.documentsLoaded.length;
        },

        totalNumberOfFiles() {
            return this.$store.getters.allDocuments.length;
        },

        hasUnsavedChanges() {
            return this.$store.getters.hasUnsavedDocuments;
        },

        isSaving() {
            return this.$store.getters.documentsAreUploading;
        },

        saveState() {
            if (this.isSaving === true) {
                return "Saving ...";
            }
            return this.hasUnsavedChanges === true
                ? "You have unsaved changes"
                : "All is calm";
        },

        saveAction() {
            return this.isSaving === true ? "Saving ..." : "";
        },
    },

    methods: {
        toggleShortcuts() {
            this.shortcutsAreVisisble = !this.shortcutsAreVisisble;
        },

        beforeUnload(event) {
            if (this.hasUnsavedChanges || this.isUploading) {
                // Cancel the event as stated by the standard.
                event.preventDefault();

                // Chrome requires returnValue to be set.
                event.returnValue = "";
            }
        },
    },

    mounted() {
        console.log(APP_VERSION, process, process.env.APP_VERSION);
        window.addEventListener("beforeunload", this.beforeUnload);
    },
};
</script>

<style scoped>
ul {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

li {
    flex: 0 0 auto;
}

li:not(:last-child) {
    margin-right: 1rem;
}

small {
    opacity: 0.5;
}
</style>
