<template>
    <div class="todo">
        <span class="todo-value" contenteditable="false">
            <input type="checkbox">
        </span>
        <p class="todo-content" ref="content" :contenteditable="view.editable.toString()"></p>
    </div>
</template>

<script>

export default {

    name: "AppTodo",

    props: ['node', 'updateAttrs', 'view'],
    
}

</script>