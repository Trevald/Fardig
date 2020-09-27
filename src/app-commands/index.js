import Commands from "./Commands"
import defaultCommands from "./default-commands"

const AppCommands = {
	install(Vue, args = {}) {
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

		Vue.prototype["$" + this.name] = commands
	},
}

export default AppCommands
