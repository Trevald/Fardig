<template>
    <nav class="app-sidebar">
        Hello sidebar!
        <div v-for="tag in allTags" :key="tag.label">
            <button class="app-command-results-heading no-style">{{ tag.label }}</button>
            <ul class="app-command-results no-style">
                <li v-for="doc in tag.documents" :key="doc.id">
                    <router-link
                        :to="{
                            name: 'Document',
                            params: { documentId: doc.id },
                        }"
                        class="no-style"
                    >
                        <AppIcon :svg="documentIcon" />
                        <span
                            class=""
                            style="overflow:hidden; white-space: nowrap; text-overflow: ellipsis"
                            >{{ documentGetTitle(doc) }}</span
                        ></router-link
                    >
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
import { documentGetTagsLabels, documentGetTitle } from "./../utils/document";
import AppIcon from "./AppIcon";

export default {
    name: "AppSidebar",

    components: { AppIcon },

    data() {
        return {
            documentIcon:
                '<path fill-rule="evenodd" clip-rule="evenodd" d="M4 4C4 3.46957 4.21071 2.96086 4.58579 2.58579C4.96086 2.21071 5.46957 2 6 2H10.586C11.1164 2.00011 11.625 2.2109 12 2.586L15.414 6C15.7891 6.37499 15.9999 6.88361 16 7.414V16C16 16.5304 15.7893 17.0391 15.4142 17.4142C15.0391 17.7893 14.5304 18 14 18H6C5.46957 18 4.96086 17.7893 4.58579 17.4142C4.21071 17.0391 4 16.5304 4 16V4ZM6 10C6 9.73478 6.10536 9.48043 6.29289 9.29289C6.48043 9.10536 6.73478 9 7 9H13C13.2652 9 13.5196 9.10536 13.7071 9.29289C13.8946 9.48043 14 9.73478 14 10C14 10.2652 13.8946 10.5196 13.7071 10.7071C13.5196 10.8946 13.2652 11 13 11H7C6.73478 11 6.48043 10.8946 6.29289 10.7071C6.10536 10.5196 6 10.2652 6 10ZM7 13C6.73478 13 6.48043 13.1054 6.29289 13.2929C6.10536 13.4804 6 13.7348 6 14C6 14.2652 6.10536 14.5196 6.29289 14.7071C6.48043 14.8946 6.73478 15 7 15H13C13.2652 15 13.5196 14.8946 13.7071 14.7071C13.8946 14.5196 14 14.2652 14 14C14 13.7348 13.8946 13.4804 13.7071 13.2929C13.5196 13.1054 13.2652 13 13 13H7Z" />',
        };
    },

    computed: {
        allDocuments() {
            return this.$store.getters.allDocuments;
        },

        allTags() {
            const blacklist = ["meeting", "presentation"];
            const tags = [];
            this.allDocuments.forEach((doc) => {
                const tagsForThisDoc = documentGetTagsLabels(doc);
                tagsForThisDoc.forEach((tagForThisDoc) => {
                    if (blacklist.includes(tagForThisDoc)) {
                        return;
                    }
                    const existingTag = tags.find((tag) => tag.label === tagForThisDoc);
                    if (existingTag === undefined) {
                        tags.push({
                            label: tagForThisDoc,
                            lastChanged: doc.lastChanged,
                            documents: [doc],
                        });
                    } else if (existingTag.lastChanged < doc.lastChanged) {
                        existingTag.lastChanged = doc.lastChanged;
                        existingTag.documents.push(doc);
                    } else {
                        existingTag.documents.push(doc);
                    }
                });
            });

            console.log("before Sort", tags);
            /*
            return tags.sort((a, b) => {
                return b.lastChanged - a.lastChanged;
            });
            */
            return tags;
        },

        __allTags() {
            let tags = [];
            let tagsWithTimestamp = [];
            this.allDocuments.forEach((doc) => {
                const tagsForThisDoc = documentGetTagsLabels(doc);
                const tagsWithTimestampForThisDoc = tagsForThisDoc.map((tag) => {
                    return {
                        label: tag,
                        lastChanged: doc.lastChanged,
                    };
                });
                tags = tags.concat(tagsForThisDoc);
                tagsWithTimestamp = tagsWithTimestamp.concat(tagsWithTimestampForThisDoc);
            });

            return tags;
            // return [...new Set(tags)];
        },

        groupedTags() {
            // const blackList = ["meeting"];
            // asd
            return [];
        },
    },

    methods: {
        documentGetTitle(doc) {
            return documentGetTitle(doc);
        },
    },

    mounted() {
        console.log(this.allTags);
        // lastUpdated || lastChanged, tags[]
    },
};
</script>
