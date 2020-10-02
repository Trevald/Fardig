import AppPresentation from "./AppPresentation"

export default {
	install(args) {
		this.addRoutes(args.router)
		this.addCommands(args.genie, args.router)
	},

	addRoutes(router) {
		router.addRoutes([
			{
				name: "Presentation",
				path: "/doc/:documentId/presentation",
				component: AppPresentation,
			},
		])
	},

	addCommands(genie, router) {
		genie.addCommand({
			id: "TOGGLE_PRESENTATION",
			description: "Toggle presentation mode",
			icon:
				'<path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z"></path>',
			shortcut: "meta+shift+p",
			callback: () => {
				router.push({
					name: "Presentation",
					params: { documentId: router.currentRoute.params.documentId },
				})
			},
		})
	},
}
