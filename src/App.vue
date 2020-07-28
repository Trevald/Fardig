<template>
  <div id="app">
    <AppProgress
      v-if="loggedIn && !allFilesAreLoaded"
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
        <AppCommand
          v-if="showCommand"
          @close="closeCommand"
        />
      </transition>
    </div>
  </div>
</template>

<script>
import AppCommand from "./components/AppCommand";
import AppHeader from "./components/AppHeader";
import AppProgress from "./components/AppProgress";
import AppStatus from "./components/AppStatus";
import DropboxApi from "./cloud/dropbox";

import {
  documentGetCommitInfo,
  documentGetTitle,
  documentGetJsonFromMarkdown,
} from "./utils/document";

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
      showCommand: false,
      totalNumberOfFiles: undefined,
      numberOfFilesLoaded: 0,
    };
  },

  computed: {
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

    keymap() {
      return {
        "ctrl+s": () => {
          this.upload();
        },
        "ctrl+space": () => {
          this.showCommand = !this.showCommand;
        },
        "ctrl+p": () => {
          this.showCommand = !this.showCommand;
        },
      };
    },
  },

  methods: {
    getTitle(doc) {
      return documentGetTitle(doc);
    },

    closeCommand() {
      this.showCommand = false;
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
        this.$store.commit("updateDocument", {
          id: fileToUpload.id,
          rev: doc.rev,
          isUploading: false,
        });
      });
    },

    login() {
      this.cloudStorage = new DropboxApi(this.accessToken);
      if (!this.cloudStorage.isAuthenticated()) {
        this.dropboxAuthLink = this.cloudStorage.getAuthUrl();
      } else {
        this.cloudStorage.getEntries().then((files) => {
          files = files.filter((file) => file[".tag"] === "file");
          let loadedFiles = [];

          this.totalNumberOfFiles = files.length;
          files.forEach((file) => {
            this.cloudStorage
              .getContents(file.path_lower)
              .then((fileContent) => {
                file.json = documentGetJsonFromMarkdown(fileContent);

                this.$store.commit("addDocument", file);
                loadedFiles.push(file.id);
                this.numberOfFilesLoaded++;
                if (loadedFiles.length === files.length) {
                  this.allFilesLoaded();
                }
              });
          });
        });
      }
    },

    allFilesLoaded() {
      this.documents.forEach((file) => {
        if (this.documentId === file.id) {
          this.$store.commit("setActiveDocument", { id: file.id });
        } else if (this.openDocuments.includes(file.id)) {
          this.$store.commit("openDocument", { id: file.id });
        }
      });

      if (this.activeDocument === undefined) {
        this.$store.commit("setActiveDocument", {
          id: this.$store.getters.firstDocument.id,
        });
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
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.app-progress {
  position: fixed;
  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%);
}
</style>
