<template>
	<ul class="no-style filter">
		<li v-for="(tag, index) in tags" :key="index">
			<button
				class="no-style tag"
				:class="{ outline: !isTagActive(tag), 'is-active': isTagActive(tag) }"
				@click="toggleTag(tag)"
			>
				{{ tag }}
			</button>
		</li>
	</ul>
</template>

<script>
	export default {
		name: "AppTagFilter",

		props: {
			tags: Array,
		},

		computed: {
			filter() {
				if (typeof this.$route.query.filter === "string") {
					return this.$route.query.filter.split(",")
				} else if (typeof this.$route.query.filter === "object") {
					return this.$route.query.filter
				} else {
					return []
				}
			},
		},

		methods: {
			isTagActive(tag) {
				return this.filter.includes(tag)
			},

			toggleTag(tag) {
				const filter = this.filter

				if (this.isTagActive(tag)) {
					const index = filter.indexOf(tag)
					filter.splice(index, 1)
				} else {
					filter.push(tag)
				}

				const query = filter.length > 0 ? { filter: filter.join(",") } : {}

				this.$router.push({ name: "Todos", query: query })
			},
		},
	}
</script>

<style>
	ul.filter {
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		margin: 0 -0.5rem 1rem -0.5rem;
		min-height: fit-content; /* Needed for Safari to not set 0px height on UL ?!*/
	}

	ul.filter > li {
		margin: 0.5rem;
	}

	/*
.filter.has-selection button:not(.is-active) {
  opacity: 0.5;
}
*/
</style>
