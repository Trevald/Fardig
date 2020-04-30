<template>
<div>
  <editor-content :editor="editor" />
  <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
      <div>
        <button type="button" :class="{ 'is-active': isActive.bold() }" @click="commands.bold">
          Bold
        </button>
        <button type="button" class="primary" @click="commands.appTodo">
          ToDo
        </button>
        </div>
    </editor-menu-bar>
    </div>
</template>

<script>

import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import { Bold, Code, CodeBlock, Link, Heading, Italic, ListItem, OrderedList, BulletList, Blockquote  } from "tiptap-extensions"

import AppTodo from "./AppTodo.js"

export default {

    name: "AppEditor",

    components: {
        EditorContent,
        EditorMenuBar
    },
    
    data() {
        return {
            editor: null,
        }
    },
    
    mounted() {
        this.editor = new Editor({
            extensions: [
                new AppTodo(),
                new OrderedList(),
                new Blockquote(),
                new BulletList(),
                new Code(),
                new CodeBlock(),
                new Link(),
                new ListItem(),
                new Heading({ levels: [1, 2, 3] }),
                new Bold(),
                new Italic()
            ],
            content: `
                <h1>Will you ever be Fardig</h1>
                <p>This is just a boring paragraph</p>

                <p class="todo">This is my todo</p>
            `
        })
    },
    
    beforeDestroy() {
        this.editor.destroy()
    },
}
</script>
