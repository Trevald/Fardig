<template>
	<editor-menu-bar :editor="editor" class="app-editor-menubar" v-slot="{ commands, isActive }">
		<div>
			<div class="container">
				<div class="groups">
					<div class="group" v-for="(group, index) in groups" :key="index">
						<AppEditorMenuBarButton
							:commands="commands"
							:is-active="isActive"
							:name="button.name"
							v-for="(button, buttonIndex) in getButtonsByGroup(group)"
							:key="buttonIndex"
							class="menu-bar-button"
						>
							{{ button.label }}
						</AppEditorMenuBarButton>
					</div>
				</div>
			</div>
		</div>
	</editor-menu-bar>
</template>

<script>
	import { EditorMenuBar } from "tiptap"
	import AppEditorMenuBarButton from "./AppEditorMenuBarButton"

	export default {
		name: "AppEditorMenuBar",

		components: {
			EditorMenuBar,
			AppEditorMenuBarButton,
		},

		props: {
			editor: Object,
		},

		data() {
			return {
				buttons: [
					{
						name: "h1",
						label: "H1",
						group: 1,
					},
					{
						name: "h2",
						label: "H2",
						group: 1,
					},
					{
						name: "h3",
						label: "H4",
						group: 1,
					},
					{
						name: "strong",
						label: "Bold",
						group: 2,
					},
					{
						name: "em",
						label: "Italic",
						group: 2,
					},
					{
						name: "bullet_list",
						label: "Bullet list",
						group: 3,
					},
					{
						name: "ordered_list",
						label: "Ordered list",
						group: 3,
					},
					{
						name: "todo_list",
						label: "Todo list",
						group: 3,
					},
					{
						name: "blockquote",
						label: "Quote",
						group: 4,
					},
				],
			}
		},

		computed: {
			groups() {
				const groups = []
				this.buttons.forEach((button) => {
					if (!groups.includes(button.group)) {
						groups.push(button.group)
					}
				})
				return groups
			},
		},

		methods: {
			getButtonsByGroup(groupId) {
				return this.buttons.filter((button) => {
					return button.group === groupId
				})
			},
		},
	}
</script>

<style scoped>
	.app-editor-menubar {
		--_color-bg: 18, 19%, 14%;

		position: fixed;
		z-index: 10;
		left: 0rem;
		right: 0rem;
		bottom: 1.5rem;
		background: hsla(var(--_color-bg), 0.99);
		box-shadow: 0 -3px 5px hsla(var(--_color-bg), 0.99);
		backdrop-filter: blur(10px);
		padding: 1rem 0;
		/*
		background: linear-gradient(hsla(var(--_color-bg), 0) 0%, hsla(var(--_color-bg), 0.95) 25%);
        backdrop-filter: blur(1px);
    */
	}

	.app-editor-menubar .groups {
		display: flex;
		justify-content: flex-start;
	}

	.app-editor-menubar .group {
		display: flex;
	}

	.app-editor-menubar .group:not(:last-child) {
		margin-right: 2rem;
	}

	.menu-bar-button:not(:last-child) {
		margin-right: 0.5rem;
	}
</style>
