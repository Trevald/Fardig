<template>
	<div class="app-editor">
		<editor-content :editor="editor" />
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
	import { Editor, EditorContent } from "tiptap"
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
		// Mention
	} from "tiptap-extensions"

	import Bold from "./../prosemirror/nodes/Bold"
	import Italic from "./../prosemirror/nodes/Italic"

	import NodeTag from "./../nodes/NodeTag"
	import { MentionTagsMixin } from "./../mixins/MentionTagsMixin"
	import MENTION_TAGS_OPTIONS from "./../utils/mention_tags_options"

	import TodoItem from "./../prosemirror/TodoItemNode"
	import TodoList from "./../prosemirror/TodoListNode"

	export default {
		name: "AppEditor",

		components: {
			EditorContent,
		},

		props: {
			json: Object,
		},

		mixins: [MentionTagsMixin],

		data() {
			return {
				editor: null,
			}
		},

		methods: {
			getTags() {
				return this.$store.getters.tags
			},
		},

		mounted() {
			this.editor = new Editor({
				extensions: [
					new Blockquote(),
					new CodeBlock(),
					new HardBreak(),
					new Heading({ levels: [1, 2, 3, 4] }),
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
					new NodeTag(MENTION_TAGS_OPTIONS(this, this.getTags)),
				],
				content: this.json,

				onUpdate: ({ getJSON }) => {
					const json = getJSON()

					this.$emit("change", {
						json,
					})
				},
			})
		},

		beforeDestroy() {
			this.editor.destroy()
		},
	}
</script>

<style></style>
