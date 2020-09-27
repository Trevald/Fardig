export default class {
	constructor() {
		this._commands = []
	}

	get commands() {
		return this._commands
	}

	addCommand(command) {
		this.commands.push(command)
	}
}
