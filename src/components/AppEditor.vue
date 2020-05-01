<template>
<div>
  <editor-content :editor="editor" />
  <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
      <div>
        <button type="button" :class="{ 'is-active': isActive.bold() }" @click="commands.bold">
          Bold
        </button>
        <button type="button" class="primary" @click="commands.app_todo">
          ToDo
        </button>
        </div>
    </editor-menu-bar>
    </div>
</template>

<script>

import {  TEXT_FILE } from "./../text-file";

import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import { Bold, Code, CodeBlock, Link, Heading, Italic, ListItem, OrderedList, BulletList, Blockquote  } from "tiptap-extensions"

import AppTodo from "./AppTodo.js"

const marked = require('marked');

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
        const renderer = {
            paragraph(text) {
                const re = /^\[[\s|x]\].*$/gmi
                const re2 = /(\[[\s|x]\])/gmi
                const hasTodos  = text.match(re);

                console.log("text", text);
                
                // Break if no todos
                if (!hasTodos) {
                    return `<p>${text}</p>`;
                }
                const textLines = text.split(/\r?\n/);
                
                let returnValue = "";
                textLines.forEach(textLine => {
                    let isTodo = textLine.match(re2);
                    if (isTodo) {
                        const todoIndicator = isTodo[0];
                        const isTicked = todoIndicator.includes("x");                        
                        returnValue+= `<p data-type="app_todo" data-done="${isTicked}">${textLine.replace(todoIndicator, "")}</p>`;                        
                    } else {
                        returnValue+=`<p>${textLine}</p>`;
                    }
                });

                return returnValue;
            }
        }
        marked.use({ renderer });
        const content = marked(TEXT_FILE);
        
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
            content: content
        })
    },
    
    beforeDestroy() {
        this.editor.destroy()
    },
}
</script>
