<template>
    <div id="app" v-hotkey="keymap">
        <header class="app-header">
            
                <AppLogo />
                <a v-if="dropboxAuthLink" :href="dropboxAuthLink">Login with Dropbox</a>
                <button @click="upload" style="transform: scale(0.5)">Save</button>
                <input type="checkbox" v-model="shouldShowGrid">
            
        </header>
        <main class="app-main" >
            <div class="container" :class="{'show-baseline-grid': shouldShowGrid}">
                <AppEditor v-if="fileContents" :file="fileContents" @change="fileChanged" />
            </div>
        </main>
        <AppStatus class="app-status" :isSaving="isUploading" :hasUnsavedChanges="hasUnsavedChanges" />
    </div>
</template>

<script>

import AppEditor from './components/AppEditor.vue'
import AppLogo from './components/AppLogo.vue'
import AppStatus from './components/AppStatus.vue'

import DropboxApi from "./cloud/dropbox";
import TurndownService from "turndown";

import DocumentHandler from "./utils/DocumentHandler";


export default {
    name: 'App',

    components: {
        AppEditor,
        AppLogo,
        AppStatus
    },

    data() {
        return {
            activeFile: undefined,
            dropboxAuthLink: undefined,
            cloudStorage: undefined,
            fileMeta: undefined,
            newFile: undefined,
            turndownService: undefined,
            shouldShowGrid: false
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
            console.log("fc", this.activeFile?.contents);
            return this.activeFile?.contents;
        },

        hasUnsavedChanges() {
            return this.lastUpdated < this.lastChanged;
        },

        keymap() {
            return {
                "ctrl+s": () => {
                    this.upload();
                }
            }
        }
    },

  methods: {
      upload() {
          const filesCommitInfo = this.activeFile.getCommitInfo();

          this.cloudStorage.storeContents(filesCommitInfo).then(file => {
              this.activeFile.isUploading = false;
              
              console.log('upload', file);
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
                    console.log("state", state);
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
                        window.DOCUMENT_HANDLER.add(file, fileContent);
                        if (this.activeFile === undefined) {
                            this.activeFile = window.DOCUMENT_HANDLER.get(file.id);
                        }
                    })
                })
            })  
        }
    }
  },

    created() {
        window.DOCUMENT_HANDLER = new DocumentHandler();
    },
  mounted() {
      this.login();
  }
}
</script>

<style scoped>


</style>
