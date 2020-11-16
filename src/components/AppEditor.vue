<template>
    <div class="app-editor">
        <AppEditorMenuBar :editor="editor" />
        <editor-content :editor="editor" class="app-editor-content" />
        <div
            class="suggestion-list"
            v-show="mentionTagsShowSuggestions"
            ref="mentionTagsSuggestions"
        >
            <template v-if="mentionTagsHasResults">
                <div
                    v-for="(tag, index) in mentionTagsFilteredTags"
                    :key="index"
                    class="suggestion-list__item"
                    :class="{
                        'is-selected': mentionTagsNavigatedTagIndex === index,
                    }"
                    @click="mentionTagsSelectTag(tag)"
                >
                    {{ tag }}
                </div>
            </template>
            <div v-else class="suggestion-list__item is-empty">
                No tags found
            </div>
        </div>
    </div>
</template>

<script>
import { Editor, EditorContent } from "tiptap";
import {
    Blockquote,
    CodeBlock,
    HardBreak,
    Heading,
    OrderedList,
    BulletList,
    ListItem,
    Code,
    Link,
    Strike,
    History,
    // Focus,
    // Mention
} from "tiptap-extensions";

import Bold from "./../prosemirror/nodes/Bold";
import Italic from "./../prosemirror/nodes/Italic";
import Image from "./../nodes/NodeImage";

import NodeTag from "./../nodes/NodeTag";
import { MentionTagsMixin } from "./../mixins/MentionTagsMixin";
import MENTION_TAGS_OPTIONS from "./../utils/mention_tags_options";

import TodoItem from "./../prosemirror/TodoItemNode";
import TodoList from "./../prosemirror/TodoListNode";

import AppEditorMenuBar from "./AppEditorMenuBar";

export default {
    name: "AppEditor",

    components: {
        EditorContent,
        AppEditorMenuBar,
    },

    props: {
        json: Object,
    },

    mixins: [MentionTagsMixin],

    data() {
        return {
            editor: null,
        };
    },

    methods: {
        getTags() {
            return this.$store.getters.tags;
        },

        async uploadImage(image) {
            console.log("Uploading…", image);
            const fileName = image.name;
            const file = await this.$store.dispatch("storeContents", {
                contents: new Blob([image], { type: image.type }),
                autorename: true,
                mode: "add",
                path: `/images/${fileName}`,
            });
            console.log("uploadImageDone", file);

            return file;
        },
    },

    mounted() {
        this.editor = new Editor({
            extensions: [
                new Blockquote(),
                new CodeBlock(),
                new HardBreak(),
                new Heading({ levels: [1, 2, 3, 4] }),
                new Image(null, null, this.uploadImage),
                new BulletList(),
                new OrderedList(),
                new ListItem(),
                new TodoItem(),
                new TodoList(),
                new Bold(),
                new Code(),
                new Italic(),
                new Link(),
                new Strike(),
                new History(),
                /*
					new Focus({
						className: "has-focus",
						nested: true,
                    }),
                    */
                new NodeTag(MENTION_TAGS_OPTIONS(this, this.getTags)),
            ],
            autoFocus: true,
            content: this.json,

            onUpdate: ({ state, getJSON }) => {
                const doc = state.doc;
                const docLength = doc.nodeSize - 2;
                const text = state.doc.textBetween(0, docLength, " ");

                const json = getJSON();

                this.$emit("change", {
                    json,
                    text,
                });
            },
        });
    },

    beforeDestroy() {
        this.editor.destroy();
    },
};
</script>

<style>
figure.has-focus {
    border-radius: 3px;
    box-shadow: 0 0 0 3px #3ea4ffe6;
}
</style>
