import tippy, { sticky } from 'tippy.js'

export const MentionTagsMixin = {
    data() {
        return {
            mentionTagsQuery: null,
            mentionTagsSuggestionRange: null,
            mentionTagsFilteredTags: [],
            mentionTagsNavigatedTagIndex: 0,
            mentionTagsInsertTag: () => {},
        }
    },

    computed: {
        mentionTagsHasResults() {
            return this.mentionTagsFilteredTags.length
        },

        mentionTagsShowSuggestions() {
            return this.mentionTagsQuery || this.mentionTagsHasResults
        }
    },

    methods: {
        mentionTagsUpHandler() {
            this.mentionTagsNavigatedTagIndex = ((this.mentionTagsNavigatedTagIndex + this.mentionTagsFilteredTags.length) - 1) % this.mentionTagsFilteredTags.length
        },

        mentionTagsDownHandler() {
            this.mentionTagsNavigatedTagIndex = (this.mentionTagsNavigatedTagIndex + 1) % this.mentionTagsFilteredTags.length
        },

        mentionTagsEnterHandler() {
            const tag = this.mentionTagsFilteredTags[this.mentionTagsNavigatedTagIndex]
            console.log("mentionTagsEnterHandler", this.mentionTagsFilteredTags, this.mentionTagsNavigatedTagIndex);
            if (tag) {
                this.mentionTagsSelectTag(tag)
            }
        },

        // we have to replace our suggestion text with a mention
        // so it's important to pass also the position of your suggestion text
        mentionTagsSelectTag(tag) {
            console.log("mentionTagsSelectTag");
            this.mentionTagsInsertTag({
                range: this.mentionTagsSuggestionRange,
                attrs: {
                    id: 1,
                    label: tag
                },
            })
            this.editor.focus()
        },

        // renders a popup with suggestions
        // tiptap provides a virtualNode object for using popper.js (or tippy.js) for popups
        mentionTagsRenderPopup(node) {
            if (this.mentionTagsPopup) { return }
            // ref: https://atomiks.github.io/tippyjs/v6/all-props/
            this.mentionTagsPopup = tippy('#app', {
                getReferenceClientRect: node.getBoundingClientRect,
                appendTo: () => document.body,
                interactive: true,
                sticky: true, // make sure position of tippy is updated when content changes
                plugins: [sticky],
                content: this.$refs.mentionTagsSuggestions,
                trigger: 'mouseenter', // manual
                showOnCreate: true,
                theme: 'dark',
                placement: 'top-start',
                inertia: true,
                duration: [400, 200],
            })
        },

        mentionTagsDestroyPopup() {
            if (this.mentionTagsPopup) {
            this.mentionTagsPopup[0].destroy()
            this.mentionTagsPopup = null
            }
        },        

    },
    
    beforeDestroy() {
        this.mentionTagsDestroyPopup()
    },
}