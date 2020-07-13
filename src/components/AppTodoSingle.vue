<template>
	<li data-type="todo_item">
		<input type="checkbox" @click="onChange" :checked="checked" tabindex="-1" />

		<div class="todo-content" ref="content">
			<p><slot></slot></p>
		</div>
	</li>
</template>

<script>
	export default {
		name: "AppTodoSingle",

		props: {
			todo: {
				type: Object,
			},
		},

		data() {
			return {
				checked: undefined,
			}
		},

		methods: {
			onChange() {
				this.checked = !this.checked
			},
		},

		mounted() {
			this.checked = this.todo.attrs.status === "done"
		},
	}
</script>
