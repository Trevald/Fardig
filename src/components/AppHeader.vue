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
                    <button
                        class="no-style close"
                        v-if="document.isLoaded"
                        @click="closeTab(document)"
                    >
                        <svg
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M2.57579 2.57581C2.6883 2.46333 2.84089 2.40014 2.99999 2.40014C3.15909 2.40014 3.31167 2.46333 3.42419 2.57581L5.99999 5.15161L8.57579 2.57581C8.63114 2.51851 8.69734 2.4728 8.77055 2.44135C8.84375 2.40991 8.92248 2.39335 9.00215 2.39266C9.08182 2.39197 9.16082 2.40715 9.23456 2.43732C9.3083 2.46749 9.37529 2.51204 9.43162 2.56837C9.48796 2.62471 9.53251 2.6917 9.56268 2.76544C9.59285 2.83918 9.60803 2.91819 9.60734 2.99785C9.60665 3.07752 9.59009 3.15625 9.55865 3.22945C9.5272 3.30266 9.48149 3.36886 9.42419 3.42421L6.84839 6.00001L9.42419 8.57581C9.53348 8.68897 9.59396 8.84053 9.59259 8.99785C9.59123 9.15517 9.52812 9.30566 9.41688 9.4169C9.30563 9.52815 9.15515 9.59125 8.99783 9.59262C8.84051 9.59398 8.68895 9.53351 8.57579 9.42421L5.99999 6.84841L3.42419 9.42421C3.31103 9.53351 3.15947 9.59398 3.00215 9.59262C2.84483 9.59125 2.69434 9.52815 2.5831 9.4169C2.47185 9.30566 2.40875 9.15517 2.40738 8.99785C2.40602 8.84053 2.46649 8.68897 2.57579 8.57581L5.15159 6.00001L2.57579 3.42421C2.46331 3.3117 2.40012 3.15911 2.40012 3.00001C2.40012 2.84091 2.46331 2.68833 2.57579 2.57581V2.57581Z"
                                fill="currentColor"
                            />
                        </svg>
                    </button>
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
        closeTab(document) {
            this.$store.commit("closeDocument", { id: document.id });
        },
        getTitle(title) {
            return documentGetTitle(title);
        },
    },
};
</script>
