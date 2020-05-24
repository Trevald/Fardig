<template>
  <p class="todo">
    <span
      class="todo-value"
      contenteditable="false"
    >
      <input
        type="checkbox"
        @click="onChange"
        :checked="checked"
      />
    </span>
    <span
      class="todo-content"
      ref="content"
      :contenteditable="view.editable.toString()"
    ></span>
  </p>
</template>

<script>
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
        state: this.checked === true ? "done" : "not started"
      });
    }
  },

  mounted() {
    this.checked = this.node.attrs.state === "done";
  }
};
</script>
