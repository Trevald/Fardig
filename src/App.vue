<template>
    <div id="app" class="container">
        <header class="app-header">
            <AppLogo />
            <a v-if="dropboxAuthLink" :href="dropboxAuthLink">Login with Dropbox</a>
            <button @click="upload" style="transform: scale(0.5)">Save</button>
        </header>
        <AppEditor v-if="fileContents" :file="fileContents" @change="fileChanged" />
        
    </div>
</template>

<script>

import AppEditor from './components/AppEditor.vue'
import AppLogo from './components/AppLogo.vue'

import DropboxApi from "./cloud/dropbox";
import TurndownService from "turndown";

export default {
  name: 'App',

  components: {
    AppEditor,
    AppLogo
  },

  data() {
      return {
          dropboxAuthLink: undefined,
          cloudStorage: undefined,
          fileContents: undefined,
          fileMeta: undefined,
          newFile: undefined,
          turndownService: undefined
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
          this.cloudStorage.storeContents(filesCommitInfo).then(file => {
              console.log('upload', file);
          });
      },

      fileChanged(html) {
          const markdown = this.convertToMarkdown(html);

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

<style>

</style>
