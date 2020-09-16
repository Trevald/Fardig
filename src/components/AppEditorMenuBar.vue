<template>
	<transition name="slide-from-bottom">
		<editor-menu-bar
			:editor="editor"
			class="app-editor-menubar"
			v-slot="{ commands, isActive }"
			v-if="isVisible"
		>
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
	</transition>
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

			isVisible() {
				return this.$store.getters.editorToolbarIsVisible
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
