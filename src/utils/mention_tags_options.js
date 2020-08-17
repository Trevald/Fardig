export default function MENTION_TAGS_OPTIONS(self) {
	return {
		/**
		 * List of suggestions
		 */
		items: () => ["private", "work", "fardig", "farmer"],

		/**
		 * Suggestion starts
		 */
		onEnter: ({ items, query, range, command, virtualNode }) => {
			console.log("Enter")
			;(self.mentionTagsQuery = query),
				(self.mentionTagsFilteredTags = items),
				(self.mentionTagsSuggestionRange = range),
				self.mentionTagsRenderPopup(virtualNode)
			self.mentionTagsInsertTag = command
		},

		/**
		 * Suggestion changes
		 */
		onChange: ({ items, query, range, virtualNode }) => {
			self.mentionTagsQuery = query
			self.mentionTagsFilteredTags = items
			self.mentionTagsSuggestionRange = range
			self.mentionTagsNavigatedTagIndex = 0
			self.mentionTagsRenderPopup(virtualNode)
		},

		/**
		 * Suggestion canceled
		 */

		onExit: () => {
			console.log("onExit")
			self.mentionTagsQuery = null
			self.mentionTagsFilteredTags = []
			self.mentionTagsSuggestionRange = null
			self.mentionTagsNavigatedTagIndex = 0
			self.mentionTagsDestroyPopup()
		},

		/**
		 * Cathc every keyDown while a suggestion is active
		 */

		onKeyDown: ({ event }) => {
			console.log("onKeyDown", event)
			switch (event.key) {
				case "ArrowUp":
					self.mentionTagsUpHandler()
					return true
				case "ArrowDown":
					self.mentionTagsUpHandler()
					return true
				case "Enter":
					self.mentionTagsEnterHandler(self.mentionTagsQuery)
					return true
				default:
					return false
			}
		},

		/**
		 * Optional filtering
		 */

		// onFilter: (items, query) => {}
	}
}
