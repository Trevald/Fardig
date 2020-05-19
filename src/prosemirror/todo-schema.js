export function todoSchema(name) {
	return {
		attrs: {
			text: { default: null },
			state: {
				default: "not started",
			},
			datetime: { default: null },
			tags: { default: [] },
			notification: { default: null },
		},

		marks: "",
		content: "text*",
		group: "block",
		selectable: true,
		defining: true,
		draggable: false,
		isText: true,
		text: {},

		parseDOM: [
			{
				priority: 51,
				tag: `[data-type="${name}"]`,
				getAttrs: (dom) => ({
					state: dom.getAttribute("data-state"),
				}),
			},
		],

		toDOM: (node) => {
			const attrs = node.attrs

			return [
				"div",
				{
					"data-type": name,
					"data-state": attrs.state,
				},
				0,
			]
		},
	}
}
