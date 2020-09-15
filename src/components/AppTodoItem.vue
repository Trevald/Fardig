<template>
	<li
		:data-type="node.type.name"
		:data-status="node.attrs.status"
		:data-id="this.id"
		data-drag-handle
	>
		<span style="position: absolute; top: -0.5rem; font-size: 0.75rem; display: none">{{
			this.id
		}}</span>
		<input type="checkbox" @click="onChange" :checked="checked" tabindex="-1" />
		<div class="todo-content" ref="content" :contenteditable="view.editable.toString()"></div>
	</li>
</template>

<script>
	import { generateID } from "../utils/helpers"
	export default {
		name: "AppTodo",

		props: ["node", "updateAttrs", "view"],

		data() {
			return {
				checked: undefined,
			}
		},

		computed: {
			id() {
				return this.node.attrs.id
			},
		},

		methods: {
			onChange() {
				this.checked = !this.checked
				this.updateAttrs({
					status: this.checked === true ? "done" : "not started",
				})
			},
		},

		mounted() {
			this.checked = this.node.attrs.status === "done"
		},

		/**
		 * Keep creation of IDs in updated hook since it seems to
		 * cause infinite loop in mounted and created hooks
		 */
		updated() {
			if (this.node.attrs.id === undefined) {
				this.updateAttrs({
					id: generateID(),
				})
			}
		},
	}
</script>
