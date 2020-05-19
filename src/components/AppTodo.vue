<template>
	<div class="todo">
		<span class="todo-value" contenteditable="false">
			<input type="checkbox" @click="onChange" :checked="checked" />
		</span>
		<p
			class="todo-content"
			ref="content"
			:contenteditable="view.editable.toString()"
		></p>
	</div>
</template>

<script>
	export default {
		name: "AppTodo",

		props: ["node", "updateAttrs", "view"],

		data() {
			return {
				checked: undefined,
			}
		},

		methods: {
			onChange() {
				this.checked = !this.checked
				this.updateAttrs({
					state: this.checked === true ? "done" : "not started",
				})
			},
		},

		mounted() {
			console.log(this.node.attrs.state)
			this.checked = this.node.attrs.state === "done"
		},
	}
</script>
