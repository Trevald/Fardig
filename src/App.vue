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
        <AppStatus class="app-status" :isSaving="isSaving" :hasUnsavedChanges="hasUnsavedChanges" />
    </div>
</template>

<script>

import AppEditor from './components/AppEditor.vue'
import AppLogo from './components/AppLogo.vue'
import AppStatus from './components/AppStatus.vue'

import DropboxApi from "./cloud/dropbox";
import TurndownService from "turndown";

export default {
    name: 'App',

    components: {
        AppEditor,
        AppLogo,
        AppStatus
    },

    data() {
        return {
            dropboxAuthLink: undefined,
            cloudStorage: undefined,
            fileContents: undefined,
            fileMeta: undefined,
            newFile: undefined,
            turndownService: undefined,
            shouldShowGrid: false,
            isSaving: false,
            lastChanged: 0,
            lastUpdate: 0
        }
    },

    computed: {
        hasUnsavedChanges() {
            return this.lastUpdate < this.lastChanged;
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
          const blob = new Blob([this.newFile], {type: 'text/plain'});
          const filesCommitInfo = {
              contents: blob,
              autorename: false,
              mode: "overwrite",
              path: this.fileMeta.path_lower
          }

          this.isSaving = true;
          this.lastUpdate = this.lastChanged;
          this.cloudStorage.storeContents(filesCommitInfo).then(file => {
              this.isSaving = false;
              
              console.log('upload', file);
          });
      },

      fileChanged(html) {
          const markdown = this.convertToMarkdown(html);
          this.lastChanged = Date.now();

          this.newFile = markdown;
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
    }
  },

  mounted() {
    this.cloudStorage = new DropboxApi();
    if (!this.cloudStorage.isAuthenticated()) {
        this.dropboxAuthLink = this.cloudStorage.getAuthUrl();
    } else {
        this.cloudStorage.getEntries().then(files => {
            console.log(files);
            this.cloudStorage.getContents(files[0].path_lower).then( file => {
                console.log(file);
                this.fileMeta = files[0];
                this.fileContents = file;
            })
        // this.file = files[0];
        });
        
    }
  }
}
</script>

<style scoped>


</style>
