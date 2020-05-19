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
		Blockquote,
	} from "tiptap-extensions"

	import { MentionTagsMixin } from "./../mixins/MentionTagsMixin"
	import MENTION_TAGS_OPTIONS from "./../utils/mention_tags_options"

	import AppTodoNode from "./AppTodoNode"

	export default {
		name: "AppEditor",

		components: {
			EditorContent,
		},

		props: {
			html: String,
			json: Object,
		},

		mixins: [MentionTagsMixin],

		data() {
			return {
				editor: null,
			}
		},

		mounted() {
			// const content = this.html

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
					new Mention(MENTION_TAGS_OPTIONS(this)),
				],
				content: this.json,
				// content: this.html,

				onUpdate: ({ getHTML, getJSON }) => {
					const html = getHTML()
					const json = getJSON()

					this.$emit("change", {
						html,
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
