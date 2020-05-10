<template>
    <editor-content :editor="editor" />
</template>

<script>

import { Editor, EditorContent } from 'tiptap'
import { 
    Bold, 
    Code, 
    CodeBlock, 
    Link, 
    Heading, 
    Italic, 
    ListItem, 
    OrderedList, 
    BulletList, 
    Blockquote  
} from "tiptap-extensions"

import AppTodoNode from "./AppTodoNode"

const marked = require('marked');

export default {

    name: "AppEditor",

    components: {
        EditorContent
    },

    props: {
        file: String
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
                        const state = todoIndicator.includes("x") ? "done" : "not started";
                        returnValue+= `<p data-type="app_todo" data-state="${state}">${textLine.replace(todoIndicator, "")}</p>`;                        
                    } else {
                        returnValue+=`<p>${textLine}</p>`;
                    }
                });

                return returnValue;
            }
        }
        marked.use({ renderer });
        const content = marked(this.file);

        this.editor = new Editor({
            extensions: [
                new AppTodoNode(),
                new OrderedList(),
                new Blockquote(),
                new BulletList(),
                new Code(),
                new CodeBlock(),
                new Link(),
                new ListItem(),
                new Heading({ levels: [1, 2, 3, 4] }),
                new Bold(),
                new Italic()
            ],
            content: content,

            onUpdate: ({getHTML}) => {
                const newContent = getHTML();
                this.$emit("change", newContent);
            }
        })
    },
    
    beforeDestroy() {
        this.editor.destroy()
    },
}
</script>
