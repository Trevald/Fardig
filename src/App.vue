<template>
  <div id="app">
    <div
      v-if="loggedOut"
      class="app-login"
    >
      <AppLogin :dropboxAuthLink="dropboxAuthLink" />
    </div>
    <AppProgress
      v-if="loggedIn && !allFilesAreLoaded"
      :value="numberOfFilesLoaded"
      :max="totalNumberOfFiles"
      class="app-progress"
    />
    <div
      v-if="loggedIn && allFilesAreLoaded"
      class="view-col"
      v-hotkey="keymap"
    >
      <AppHeader v-if="loggedIn" />

      <main class="app-main">
        <div
          class="container"
          :class="{ 'show-baseline-grid': shouldShowGrid, view: true }"
        >
          <div
            class="view"
            v-if="activeView === 'todo'"
          >
            <article>
              <AppMyTodos />
            </article>
          </div>

          <div
            class="view"
            v-else
          >
            <article
              v-for="file in openDocuments"
              :key="file.id"
              class="view"
              v-show="activeDocumentId === file.id"
            >
              <AppDocument :file="file" />
            </article>
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
          @command="doCommand"
        />
      </transition>
    </div>
  </div>
</template>

<script>
import AppCommand from "./components/AppCommand";
import AppDocument from "./components/AppDocument";
import AppHeader from "./components/AppHeader";
import AppLogin from "./components/AppLogin";
import AppProgress from "./components/AppProgress";
import AppStatus from "./components/AppStatus";
import DropboxApi from "./cloud/dropbox";

import AppMyTodos from "./components/AppMyTodos";

import {
  documentGetCommitInfo,
  documentGetTitle,
  documentGetJsonFromMarkdown
} from "./utils/document";

export default {
  name: "App",

  components: {
    AppCommand,
    AppDocument,
    AppHeader,
    AppLogin,
    AppMyTodos,
    AppProgress,
    AppStatus
  },

  data() {
    return {
      dropboxAuthLink: undefined,
      cloudStorage: undefined,
      fileMeta: undefined,
      newFile: undefined,
      shouldShowGrid: false,
      showCommand: false,
      totalNumberOfFiles: undefined,
      numberOfFilesLoaded: 0
    };
  },

  computed: {
    allFilesAreLoaded() {
      return this.numberOfFilesLoaded === this.totalNumberOfFiles;
    },
    activeDocumentId() {
      return this.$store.getters.activeDocumentId;
    },

    activeView() {
      return this.$store.getters.activeView;
    },

    loggedIn() {
      return this.cloudStorage?.isAuthenticated();
    },

    loggedOut() {
      return !this.loggedIn;
    },

    activeDocument() {
      return this.$store.getters.activeDocument;
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
        "ctrl+q": () => {
          this.switchactiveDocument(-1);
        },
        "ctrl+w": () => {
          this.switchactiveDocument(1);
        }
      };
    }
  },

  methods: {
    getTitle(doc) {
      return documentGetTitle(doc);
    },

    doCommand(event) {
      switch (event.command) {
        case "CLOSE_ME":
          // this.showCommand = false;
          break;
        case "NEW_FILE":
          this.$store.commit("newDocument");
          break;
        case "OPEN":
          this.$store.commit("setActiveDocument", {
            id: event.id
          });
          break;
        default:
          break;
      }
      this.showCommand = false;
    },

    switchactiveDocument(indexModifier) {
      const openDocumentsArray = [...this.openDocuments];
      const activeDocumentIndexInopenDocuments = openDocumentsArray.findIndex(
        file => file.id === this.activeDocument.id
      );
      if (activeDocumentIndexInopenDocuments === -1) {
        return;
      }

      let newactiveDocumentIndex =
        activeDocumentIndexInopenDocuments + indexModifier;
      if (newactiveDocumentIndex <= -1) {
        newactiveDocumentIndex = openDocumentsArray.length - 1;
      } else if (newactiveDocumentIndex >= openDocumentsArray.length) {
        newactiveDocumentIndex = 0;
      }
      this.$store.commit("setActiveDocument", {
        id: openDocumentsArray[newactiveDocumentIndex].id
      });

      return false;
    },

    upload() {
      const fileToUpload = this.activeDocument;
      const filesCommitInfo = documentGetCommitInfo(fileToUpload);

      this.$store.commit("updateDocument", {
        id: fileToUpload.id,
        isUploading: true,
        lastUpdated: fileToUpload.lastChanged
      });

      this.cloudStorage.storeContents(filesCommitInfo).then(() => {
        this.$store.commit("updateDocument", {
          id: fileToUpload.id,
          isUploading: false
        });
      });
    },

    login() {
      this.cloudStorage = new DropboxApi();
      if (!this.cloudStorage.isAuthenticated()) {
        this.dropboxAuthLink = this.cloudStorage.getAuthUrl();
      } else {
        this.cloudStorage.getEntries().then(files => {
          let loadedFiles = [];
          this.totalNumberOfFiles = files.length;
          files.forEach(file => {
            this.cloudStorage.getContents(file.path_lower).then(fileContent => {
              file.json = documentGetJsonFromMarkdown(fileContent);
              console.log("fileContent", file);

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
      this.documents.forEach(file => {
        if (this.activeDocumentId === file.id) {
          this.$store.commit("setActiveDocument", { id: file.id });
        } else if (this.openDocuments.includes(file.id)) {
          this.$store.commit("openDocument", { id: file.id });
        }
      });

      if (this.activeDocument === undefined) {
        this.$store.commit("setActiveDocument", {
          id: this.$store.getters.firstDocument.id
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
    }
  },

  mounted() {
    this.login();

    window.addEventListener("beforeunload", this.beforeUnload);
  }
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
