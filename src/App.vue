<template>
  <div id="app">
    <AppProgress
      v-if="loggedIn && numberOfFilesLoaded < totalNumberOfFiles"
      :value="numberOfFilesLoaded"
      :max="totalNumberOfFiles"
      class="app-progress"
    />
    <div
      class="view-col"
      v-hotkey="keymap"
    >
      <AppHeader v-if="loggedIn" />

      <main class="app-main">
        <div
          class="container"
          style="display: flex"
        >

          <div class="view">
            <router-view></router-view>
          </div>
        </div>

      </main>
      <AppStatus
        class="app-status"
        :isSaving="isUploading"
        :hasUnsavedChanges="hasUnsavedChanges"
      />
      <transition name="fade">
        <AppCommand v-if="commandIsVisible" />
      </transition>
    </div>
  </div>
</template>

<script>
import AppCommand from "./components/AppCommand";
import AppHeader from "./components/AppHeader";
import AppProgress from "./components/AppProgress";
import AppStatus from "./components/AppStatus";

import { documentGetCommitInfo, documentGetTitle } from "./utils/document";

import { commands } from "./commands/commands";

export default {
  name: "App",

  components: {
    AppCommand,
    AppHeader,
    AppProgress,
    AppStatus,
  },

  data() {
    return {
      dropboxAuthLink: undefined,
      cloudStorage: undefined,
      fileMeta: undefined,
      newFile: undefined,
      keymap: {},
      unsubscribeAction: undefined,
    };
  },

  computed: {
    numberOfFilesLoaded() {
      return this.$store.getters.documentsLoading;
    },

    totalNumberOfFiles() {
      return this.$store.getters.allDocuments;
    },

    allFilesAreLoaded() {
      return this.numberOfFilesLoaded === this.totalNumberOfFiles;
    },
    accessToken() {
      return this.$store.getters.accessToken;
    },

    documentId() {
      return this.$route.params.documentId;
    },

    activeView() {
      return this.$store.getters.activeView;
    },

    loggedIn() {
      return this.$store.getters.isAuthenticated;
    },

    activeDocument() {
      return this.$store.getters.getDocumentById(this.documentId);
    },

    commandIsVisible() {
      return this.$store.getters.commandIsVisible;
    },

    openDocuments() {
      return this.$store.getters.openDocuments;
    },

    documents() {
      return this.$store.getters.allDocuments;
    },

    isUploading() {
      return this.activeDocument?.isUploading;
    },

    lastChanged() {
      return this.activeDocument?.lastChanged;
    },

    lastUpdated() {
      return this.activeDocument?.lastUpdated;
    },

    fileContents() {
      return this.activeDocument?.contents;
    },

    hasUnsavedChanges() {
      return this.lastUpdated < this.lastChanged;
    },
  },

  methods: {
    getTitle(doc) {
      return documentGetTitle(doc);
    },

    upload() {
      const fileToUpload = this.activeDocument;
      const filesCommitInfo = documentGetCommitInfo(fileToUpload);

      this.$store.commit("updateDocument", {
        id: fileToUpload.id,
        isUploading: true,
        lastUpdated: fileToUpload.lastChanged,
      });

      this.cloudStorage.storeContents(filesCommitInfo).then((doc) => {
        if (doc.id !== fileToUpload.id) {
          this.$router.replace({
            name: "Document",
            params: { documentId: doc.id },
          });
        }
        this.$store.commit("updateDocument", {
          id: fileToUpload.id,
          rev: doc.rev,
          isUploading: false,
        });
      });
    },

    login() {
      if (!this.$store.getters.isAuthenticated) {
        console.log("Loged out!");
        this.dropboxAuthLink = this.$store.getters.dropboxAuthLink;
      } else {
        console.log("Loged in!");
        this.$store.dispatch("fetchDocuments");
      }
    },

    setActiveView(view, file) {
      this.$store.commit("setActiveView", { name: view });

      if (file) {
        this.$store.commit("setActiveDocument", { id: file.id });
      }
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
    this.login();

    window.addEventListener("beforeunload", this.beforeUnload);

    this.unsubscribeAction = this.$store.subscribeAction({
      after: (action, state) => {
        console.log("aftersub", action, state);
        switch (action.type) {
          case "saveDocument":
            this.upload();
            break;
        }
      },
    });
  },

  beforeDestroy() {
    this.unsubscribeAction();
  },

  created() {
    commands.forEach((command) => {
      if (command.shortcut) {
        this.keymap[command.shortcut] = (event) => {
          event.preventDefault();
          this.$store.dispatch(command.action);
        };
      }
    });
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
