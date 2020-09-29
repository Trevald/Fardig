import Commands from "./Commands"
import defaultCommands from "./default-commands"
import { store } from "./../../main"

const Genie = {
	install(vue, args = {}) {
		if (this.intalled) {
			return
		}

		// Set up object
		this.installed = true
		this.params = args
		this.name = "genie"

		const commands = new Commands()

		// Add default commands
		defaultCommands.forEach((command) => {
			commands.addCommand(command)
		})

		// Listen for keyboard events
		document.addEventListener("keydown", (event) => {
			const command = commands.keyHandler(event)
			if (command) {
				store.dispatch(command.action)
			}
		})

		vue.prototype["$" + this.name] = commands
	},
}

export default Genie
