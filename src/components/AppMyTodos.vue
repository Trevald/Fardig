<template>
	<div class="view">
		<h1>My ToDo</h1>
		<ul>
			<li v-for="document in documentsWithTodos" :key="document.id">
				{{ document.name }}
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		name: "AppMyTodos",

		data() {
			return {}
		},

		computed: {
			documentsWithTodos() {
				return this.$store.getters.documentsWithTodos
			},
		},
	}
</script>
