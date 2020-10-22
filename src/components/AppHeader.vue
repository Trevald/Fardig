<template>
    <header class="app-header">
        <nav class="tabs" v-if="openDocuments">
            <ul>
                <li v-for="(document, index) in openDocuments" :key="index">
                    <router-link
                        :to="{
                            name: 'Document',
                            params: { documentId: document.id },
                        }"
                    >
                        {{ getTitle(document) }}
                        <transition name="fade">
                            <progress
                                class="spinner"
                                v-if="!document.isLoaded"
                            />
                        </transition>
                    </router-link>
                </li>
            </ul>
            <ul>
                <li class="todos-link">
                    <router-link :to="{ name: 'Todos' }">
                        Todos
                    </router-link>
                </li>
            </ul>
        </nav>
    </header>
</template>

<script>
import { documentGetTitle } from "./../utils/document";

export default {
    name: "AppHeader",

    computed: {
        openDocuments() {
            return this.$store.getters.openDocuments;
        },
    },

    methods: {
        getTitle(title) {
            return documentGetTitle(title);
        },
    },
};
</script>
