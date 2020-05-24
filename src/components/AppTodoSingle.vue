<template>
  <p class="todo">
    <span class="todo-value">
      <input
        type="checkbox"
        @click="onChange"
        :checked="checked"
      />
    </span>
    <span class="todo-content">
      <slot></slot>
    </span>
  </p>
</template>

<script>
export default {
  name: "AppTodoSingle",

  props: {
    todo: {
      type: Object
    }
  },

  data() {
    return {
      checked: undefined
    };
  },

  methods: {
    onChange() {
      this.checked = !this.checked;
    }
  },

  mounted() {
    console.log(this.todo);
    this.checked = this.todo.attrs.state === "done";
  }
};
</script>
