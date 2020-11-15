<template>
    <div class="vue-genie-confirm-overlay">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "GenieConfirmComponent",
};
</script>

<style type="text/css">
.vue-genie-confirm-overlay {
    position: fixed;
    z-index: 100;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}
</style>
