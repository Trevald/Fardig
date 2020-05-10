<template>
    <div id="app" v-hotkey="keymap">
        <header class="app-header">
            <a v-if="dropboxAuthLink" :href="dropboxAuthLink">Login with Dropbox</a>
            <!--<button @click="upload" style="transform: scale(0.5)">Save</button>
            <input type="checkbox" v-model="shouldShowGrid">-->
            <nav class="tabs">
                <ul>
                <li v-for="file in openFiles" :key="file.id">
                    <button class="no-style" type="button" @click="activeFile = file" :class="{'is-active': activeFile.id === file.id}">{{file.name}}</button>
                </li>
            </ul>
            </nav>
        </header>
        <main class="app-main" >
            <div class="container" :class="{'show-baseline-grid': shouldShowGrid}">
                <AppEditor v-if="fileContents" :file="fileContents" @change="fileChanged" />
            </div>
        </main>
        <AppStatus class="app-status" :isSaving="isUploading" :hasUnsavedChanges="hasUnsavedChanges" />
        <transition name="fade">
            <AppCommand v-if="documentHandler && showCommand" :documents="documentHandler.documents" @command="doCommand" />
        </transition>
    </div>
</template>

<script>

import AppCommand from "./components/AppCommand"
import AppEditor from './components/AppEditor.vue'
import AppStatus from './components/AppStatus.vue'

import DropboxApi from "./cloud/dropbox";
import TurndownService from "turndown";

import DocumentHandler from "./utils/DocumentHandler";

export default {
    name: 'App',

    components: {
        AppCommand,
        AppEditor,
        AppStatus
    },

    data() {
        return {
            activeFile: undefined,
            openFiles: new Set(),
            documentHandler: undefined,
            dropboxAuthLink: undefined,
            cloudStorage: undefined,
            fileMeta: undefined,
            newFile: undefined,
            turndownService: undefined,
            shouldShowGrid: false,
            showCommand: false
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
                this.activeFile = this.documentHandler.createNew()
                this.openFiles.add(this.activeFile)
                console.log(this.activeFile)
                break
            case "OPEN":
                this.activeFile = this.documentHandler.get(event.id)
                break
            default:
                    break
          }
          this.showCommand = false;
      },

      upload() {
          const filesCommitInfo = this.activeFile.getCommitInfo();

          this.cloudStorage.storeContents(filesCommitInfo).then(() => {
              this.activeFile.isUploading = false;
          });
      },

      fileChanged(html) {
          const markdown = this.convertToMarkdown(html);
          this.activeFile.lastChanged = Date.now();

          this.activeFile.contents = markdown;
      },

    convertToMarkdown(html) {
        if (this.turndownService === undefined) { 
            this.turndownService = new TurndownService({
                headingStyle: "atx",
            });

            this.turndownService.addRule('todo', {
                filter: (node) => {
                    return node.getAttribute("data-type") === "app_todo";  // [data-type="${this.name}"]
                },
                replacement: function (content, node) {
                    const state = node.getAttribute("data-state") === "done" ? "x" : " ";
                    return `[${state}] ${content}\n`;
                }
            });
            
            
        }

        const markdown = this.turndownService.turndown(html);

        return markdown;
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
                
                files.forEach(file => {
                    this.cloudStorage.getContents(file.path_lower).then( fileContent => {
                        this.documentHandler.add(file, fileContent);
                        if (this.activeFile === undefined) {
                            this.activeFile = this.documentHandler.get(file.id);
                            this.openFiles.add(this.activeFile);
                        }
                    })
                })
            })  
        }
    }
  },

  created() {
      this.documentHandler = new DocumentHandler();
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
