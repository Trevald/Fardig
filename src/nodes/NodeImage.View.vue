<template>
  <figure
    tabindex="0"
    @dblclick="hello"
    @keydown="handleKeyDown"
  >
    <img
      :src="src"
      :alt="alt"
      :title="title"
      :data-id="id"
      :data-path="path"
      v-if="imageCanBeSeen"
    />
    <transition name="fade-slow">
      <AppLoaderImageProgress
        direction="up"
        ref="uploading"
        v-if="uploading"
      />
    </transition>
    <transition name="fade-slow">
      <AppLoaderImageProgress
        direction="down"
        ref="downloading"
        v-if="downloading"
      />
    </transition>

    <div
      class="image-loader"
      v-if="loading"
    >
      <AppSpinner :size="10" />
    </div>
  </figure>
</template>

<script>
import AppSpinner from "./../components/AppSpinner";
import AppLoaderImageProgress from "./../components/AppLoaderImageProgress";

export default {
  name: "AppImage",

  components: {
    AppLoaderImageProgress,
    AppSpinner,
  },

  props: ["node", "updateAttrs", "view", "getPos"],

  data() {
    return {
      loading: false,
      downloading: false,
      uploading: false,
      keymap: {
        backspace: (event) => {
          event.preventDefault();
          this.deleteNode();
        },
      },
    };
  },

  computed: {
    id() {
      return this.node.attrs.id;
    },
    src() {
      return this.node.attrs.base64 || this.node.attrs.path;
    },
    alt() {
      return this.node.attrs.alt;
    },
    title() {
      return this.node.attrs.title;
    },
    path() {
      return this.node.attrs.path;
    },
    imageCanBeSeen() {
      return this.node.attrs.base64;
    },
  },

  methods: {
    handleKeyDown(event) {
      switch (event.keyCode) {
        case 8:
          this.deleteNode();
          break;
        default:
          break;
      }
    },

    hello() {
      const image = new Image();
      image.src = this.src;

      const imageWindow = window.open("");
      imageWindow.document.write(image.outerHTML);
    },

    deleteNode() {
      // make a prosemirror transaction
      // which available on editor node
      let tr = this.view.state.tr;
      let pos = this.getPos();
      tr.delete(pos, pos + this.node.nodeSize);
      this.view.dispatch(tr);
    },

    async uploadImage(image) {
      console.log("Image Vue Uploading…", image);
      this.$store.commit("disableCommand", {
        key: "IMAGE_IS_UPLOADING",
        name: "saveDocument",
        description: "Can’t save while image is uploading",
      });
      const fileName = this.makeSafeMDFileName(image.name);
      try {
        const file = await this.$store.dispatch("storeContents", {
          contents: new Blob([image], { type: image.type }),
          autorename: true,
          mode: "add",
          path: `/images/${fileName}`,
        });
        console.log("Image Vue  uploadImageDone", file);
        this.$store.commit("enableCommand", {
          key: "IMAGE_IS_UPLOADING",
        });

        return file;
      } catch (error) {
        console.error("Failed to upload image", error);
        this.$store.commit("enableCommand", {
          key: "IMAGE_IS_UPLOADING",
        });
      }
    },

    makeSafeMDFileName(fileName) {
      const parts = fileName.split(".");
      const suffix = parts[parts.length - 1];
      const name = parts.slice(0, parts.length - 1).join("");
      const safeName = name.replace(/ /g, "_").replace(/\)|\(|\]|\[/g, "-");

      return `${safeName}-${Date.now()}.${suffix}`;
    },

    addNewImage(imageData) {
      this.setLoader("uploading", true);
      this.uploadImage(imageData).then((fileData) => {
        this.updateAttrs({
          path: fileData.path_lower,
          id: fileData.id,
        });

        this.setLoader("uploading", false);
      });
    },

    async getExistingImage(path) {
      this.setLoader("downloading", true);
      const base64 = await this.$store.dispatch("getFile", path);

      this.updateAttrs({
        base64: base64,
      });

      this.setLoader("downloading", false);
    },

    setLoader(direction, value) {
      if (value === true) {
        this[direction] = value;
      } else {
        this.$refs[direction].done();
        setTimeout(() => {
          this[direction] = false;
        }, 100);
      }
    },
  },

  mounted() {
    const { imageData, path } = this.node.attrs;

    if (imageData) {
      this.addNewImage(imageData);
    } else if (path) {
      this.getExistingImage(path);
    }
  },
};
</script>

<style scoped>
figure:focus {
  outline: 2px solid lightblue;
  outline-offset: 0.25rem;
}
.image-loader {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  width: 10%;
}
</style>
