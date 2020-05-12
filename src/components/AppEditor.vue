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

export default {

    name: "AppEditor",

    components: {
        EditorContent
    },

    props: {
        html: String
    },
    
    data() {
        return {
            editor: null
        }
    },
    
    mounted() {
        const content = this.html;

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
