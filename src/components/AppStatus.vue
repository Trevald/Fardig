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
                <AppLogo />
            </li>
        </ul>
        <transition name="fade">
            <AppShortcuts v-if="shortcutsAreVisisble" />
        </transition>
    </div>
</template>

<script>
import AppLogo from "./AppLogo";

import AppShortcuts from "./AppShortcuts";

export default {
    name: "AppStatus",

    components: {
        AppLogo,
        AppShortcuts,
    },

    data() {
        return {
            shortcutsAreVisisble: false,
        };
    },

    computed: {
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
</style>
