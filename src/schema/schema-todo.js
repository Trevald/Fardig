export const schemaTodo = {
	attrs: {
		text: { default: null },
		state: {
			default: "not started",
		},
		datetime: { default: null },
		tags: { default: [] },
		notification: { default: null },
	},

	content: "inline*",
	group: "block",

	parseDOM: [
		{
			priority: 51,
			tag: `[data-type="app_todo"]`,
			getAttrs: (dom) => ({
				state: dom.getAttribute("data-state"),
			}),
		},
	],

	toDOM: (node) => {
		const attrs = node.attrs

		return [
			"p",
			{
				"data-type": "app_todo",
				"data-state": attrs.state,
			},
			0,
		]
	},
}
