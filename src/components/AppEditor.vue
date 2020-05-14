<template>
    <div class="app-editor">
        <editor-content :editor="editor" />
            <div class="suggestion-list" v-show="mentionTagsShowSuggestions" ref="mentionTagsSuggestions">
      
            <template v-if="mentionTagsHasResults">
                <div
                    v-for="(tag, index) in mentionTagsFilteredTags"
                    :key="index"
                    class="suggestion-list__item"
                    :class="{ 'is-selected': mentionTagsNavigatedTagIndex === index }"
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

import { Editor, EditorContent } from 'tiptap'
import { 
    Bold, 
    Code, 
    CodeBlock, 
    Link, 
    Heading, 
    Italic, 
    ListItem,
    Mention, 
    OrderedList, 
    BulletList, 
    Blockquote  
} from "tiptap-extensions"

import { MentionTagsMixin } from "./../mixins/MentionTagsMixin"
import MENTION_TAGS_OPTIONS from "./../utils/mention_tags_options"

import AppTodoNode from "./AppTodoNode"

export default {

    name: "AppEditor",

    components: {
        EditorContent
    },

    props: {
        html: String
    },

     mixins: [MentionTagsMixin],
    
    data() {
        return {
            editor: null,
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
                new Italic(),
                new Mention(MENTION_TAGS_OPTIONS(this))
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


<style>

.mention {
  background: rgba(black, 0.1);
  color: rgba(black, 0.6);
  font-size: 0.8rem;
  font-weight: bold;
  border-radius: 5px;
  padding: 0.2rem 0.5rem;
  white-space: nowrap;
}
.mention-suggestion {
  color: rgba(black, 0.6);
}
.suggestion-list {
  padding: 0.2rem;
  border: 2px solid rgba(black, 0.1);
  font-size: 0.8rem;
  font-weight: bold;
}
  .suggestion-list__no-results {
    padding: 0.2rem 0.5rem;
  }
  .suggestion-list__item {
    border-radius: 5px;
    padding: 0.2rem 0.5rem;
    margin-bottom: 0.2rem;
    cursor: pointer;
  }
.suggestion-list__item:last-child {
      margin-bottom: 0;
    }
    .suggestion-list__item.is-selected,
    .suggestion-list__item:hover {
      background-color: rgba(white, 0.2);
    }
    .suggestion-list__item.is-empty {
      opacity: 0.5;
    }
  

.tippy-box[data-theme~=dark] {
  background-color: black;
  padding: 0;
  font-size: 1rem;
  text-align: inherit;
  color: white;
  border-radius: 5px;
}

</style>
