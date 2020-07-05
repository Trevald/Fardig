<template>
  <li
    :data-type="node.type.name"
    :data-status="node.attrs.status"
    data-drag-handle
  >

    <input
      type="checkbox"
      @click="onChange"
      :checked="checked"
      tabindex="-1"
    />
    <div
      class="todo-content"
      ref="content"
      :contenteditable="view.editable.toString()"
    ></div>
  </li>
</template>

<script>
/*

		return {
			props: ["node", "updateAttrs", "view"],
			methods: {
				onChange() {
					this.updateAttrs({
						done: !this.node.attrs.done,
					})
				},
			},
			template: `
        <li :data-type="node.type.name" :data-done="node.attrs.done.toString()" data-drag-handle>
          <span class="todo-checkbox" contenteditable="false" @click="onChange"></span>
          <div class="todo-content" ref="content" :contenteditable="view.editable.toString()"></div>
        </li>
      `,
		}

*/

export default {
  name: "AppTodo",

  props: ["node", "updateAttrs", "view"],

  data() {
    return {
      checked: undefined
    };
  },

  methods: {
    onChange() {
      this.checked = !this.checked;
      this.updateAttrs({
        status: this.checked === true ? "done" : "not started"
      });
    }
  },

  mounted() {
    this.checked = this.node.attrs.status === "done";
  }
};
</script>
