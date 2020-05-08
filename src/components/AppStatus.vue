<template>
    <div class="app-status">
        <ul class="no-list">
            <li>{{saveState}}</li>
        </ul>
    </div>
</template>

<script>

    export default {

        name: "AppStatus",

        props: {
            hasUnsavedChanges: {
                type: Boolean,
                default: false
            },
            isSaving: {
                type: Boolean,
                default: false
            }
        },

        computed: {
            saveState() {
                if (this.isSaving === true) {
                    return "Saving ...";
                }
                return this.hasUnsavedChanges === true ? "You have unsaved changes" : "All is calm";
            },

            saveAction() {
                return this.isSaving === true ? "Saving ..." : "";
            }

        }

    }
</script>

<style scoped>

ul {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

li {
    flex: 0 0 auto;
}

li:not(:last-child) {
    margin-right: 1rem;
}

</style>