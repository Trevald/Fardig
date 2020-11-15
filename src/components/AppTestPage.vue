<template>
    <div>
        <h1>Test page</h1>

        <button @click="confirm">Confirm</button>
    </div>
</template>

<script>
export default {
    name: "AppTestPage",

    methods: {
        confirm() {
            this.$genieConfirm
                .confirm("Do you really want to do this?")
                .then((value) => {
                    console.log("Yes", value);
                })
                .catch((value) => {
                    console.log("No", value);
                });
        },
    },
};
</script>
