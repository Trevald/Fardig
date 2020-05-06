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
          newFile: undefined
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

      fileChanged(data) {
          console.log("fc", data);
          this.newFile = data;
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
