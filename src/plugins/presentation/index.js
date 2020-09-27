import AppPresentation from "./AppPresentation"

export default {
	install(router) {
		this.addRoutes(router)
		this.addCommands()
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

	addCommands() {},
}
