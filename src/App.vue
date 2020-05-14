<template>
    <div id="app" v-hotkey="keymap">
        <header class="app-header">
            <a v-if="dropboxAuthLink" :href="dropboxAuthLink">Login with Dropbox</a>
            <!--<button @click="upload" style="transform: scale(0.5)">Save</button>
            <input type="checkbox" v-model="shouldShowGrid">-->
            <nav class="tabs">
                <ul>
                <li v-for="file in openFiles" :key="file.id" :class="{'is-active': activeFile.id === file.id}">
                    <button class="no-style" type="button" @click="activeFile = file">{{file.title}}</button>
                </li>
            </ul>
            <ul>
                <li class="todos-link">
                    <button class="no-style" type="button">ToDos</button>
                </li>
            </ul>
            </nav>
        </header>
        <main class="app-main" >
            <div class="container" :class="{'show-baseline-grid': shouldShowGrid}">
                <ul class="no-list">
                    <li v-for="file in openFiles" :key="file.id">
                        <AppDocument v-show="activeFile.id === file.id" :file="file" :active-file="activeFile" />
                    </li>
                </ul>
            </div>
        </main>
        <AppStatus class="app-status" :isSaving="isUploading" :hasUnsavedChanges="hasUnsavedChanges" />
        <transition name="fade">
            <AppCommand v-if="documentService && showCommand" :documents="documentService.documents" @command="doCommand" />
        </transition>
    </div>
</template>

<script>

import AppCommand from "./components/AppCommand"
import AppDocument from "./components/AppDocument"
import AppStatus from './components/AppStatus.vue'

import DropboxApi from "./cloud/dropbox"

import DocumentService from "./services/DocumentService"
import UserService from "./services/UserService"

export default {
    name: 'App',

    components: {
        AppCommand,
        AppDocument,
        AppStatus
    },

    data() {
        return {
            activeFile: undefined,
            documentService: new DocumentService(),
            userService: new UserService(),
            dropboxAuthLink: undefined,
            cloudStorage: undefined,
            fileMeta: undefined,
            newFile: undefined,
            shouldShowGrid: false,
            showCommand: false,
            openFiles: new Set()
        }
    },

    computed: {

        isUploading() {
            return this.activeFile?.isUploading;
        },

        lastChanged() {
            return this.activeFile?.lastChanged;
        },

        lastUpdated() {
            return this.activeFile?.lastUpdated;
        },

        fileContents() {
            return this.activeFile?.contents;
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
                    this.switchActiveFile(-1)
                },                
                "ctrl+w": () => {
                    this.switchActiveFile(1)
                }
            }
        }
    },

  methods: {
      doCommand(event) {
          console.log("doCommand", event.command)
          switch(event.command) {
              case "CLOSE_ME":
                  // this.showCommand = false;
                  break
            case "NEW_FILE":
                this.activeFile = this.documentService.createNew()
                this.openFiles.add(this.activeFile)
                break
            case "OPEN":
                this.activeFile = this.documentService.get(event.id)
                this.openFiles.add(this.activeFile)
                break
            default:
                    break
          }
          this.showCommand = false;
          this.savePreferences();
      },

        switchActiveFile(indexModifier) {
            const openFilesArray = [...this.openFiles]
            const activeFileIndexInOpenFiles = openFilesArray.findIndex(file => file.id === this.activeFile.id);
            if (activeFileIndexInOpenFiles === -1) { return; }

            let newActiveFileIndex = activeFileIndexInOpenFiles + indexModifier;
            if (newActiveFileIndex <= -1) {
                newActiveFileIndex = openFilesArray.length -1 
            } else if(newActiveFileIndex >= openFilesArray.length) {
                newActiveFileIndex = 0
            } 

            console.log(newActiveFileIndex);

            this.activeFile = openFilesArray[newActiveFileIndex]

            return false
      },

      upload() {
          const fileToUpload = this.activeFile;
          const filesCommitInfo = fileToUpload.getCommitInfo();
          fileToUpload.lastUpdated = fileToUpload.lastChanged;

          this.cloudStorage.storeContents(filesCommitInfo).then(() => {
              fileToUpload.isUploading = false;
          });
      },

    toggleGrid() {
        this.shouldShowGrid = !this.shouldShowGrid;
        document.querySelector("html").classList.toggle("toggle-grid", this.shouldShowGrid);
    },

    login() {
        this.cloudStorage = new DropboxApi();
        if (!this.cloudStorage.isAuthenticated()) {
            this.dropboxAuthLink = this.cloudStorage.getAuthUrl();
        } else {
            this.cloudStorage.getEntries().then(files => {
                let loadedFiles = [];
                files.forEach(file => {
                    this.cloudStorage.getContents(file.path_lower).then( fileContent => {
                        this.documentService.add(file, fileContent);
                        loadedFiles.push(file.id)
                        if (loadedFiles.length === files.length) {
                            this.allFilesLoaded()
                        }
                    })
                })
            })  
        }
    },

    allFilesLoaded() {
        this.documentService.documents.forEach(file => {
            if(this.userService.activeFile === file.id) {
                this.activeFile = this.documentService.get(file.id);
                this.openFiles.add(this.activeFile);
                console.log("Is active", file.id);
            } else if(this.userService.openFiles.has(file.id)) {
                console.log("Is open", file.id);
                this.openFiles.add(this.documentService.get(file.id));
            }
        })

        if (this.activeFile === undefined) {
            this.activeFile = this.documentService.getFirst();
        }
    },

    savePreferences() {
        this.userService.updatePrefs({
            activeFile: this.activeFile,
            openFiles: this.openFiles
        });
    }
  },

  created() {

  },

  mounted() {
      this.login();
  }
}
</script>

<style scoped>
    .fade-enter-active, .fade-leave-active {
        transition: opacity .2s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }

</style>
