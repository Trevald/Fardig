<template>
    <p class="todo" style="display: flex; justify-content: flex-start; align-items: flex-start">
        <input type="checkbox">
        <span class="todo-content" ref="content" :contenteditable="view.editable.toString()"></span>
    </p>
</template>

<script>

export default {

    name: "AppTodo",

    props: ['node', 'updateAttrs', 'view'],
    
}

</script>