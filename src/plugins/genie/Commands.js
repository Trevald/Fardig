import keycodes from "./keycodes"

export default class {
	constructor() {
		this._commands = []
	}

	get commands() {
		return this._commands
	}

	addCommand(command) {
		if (command.shortcut) {
			command.keyMap = convertToKeyMap(command.shortcut)
		}
		this.commands.push(command)
	}

	keyHandler(event) {
		// const FORBIDDEN_NODES = ["INPUT", "TEXTAREA", "SELECT"]
		const { keyCode, ctrlKey, altKey, shiftKey, metaKey } = event
		const eventKeyModifiers = { ctrlKey, altKey, shiftKey, metaKey }

		/*
		const { nodeName, isContentEditable } = document.activeElement
		if (isContentEditable) return
        if (FORBIDDEN_NODES.includes(nodeName)) return
        */

		const command = getHotKeyCallback(this.commands, keyCode, eventKeyModifiers)

		if (command) {
			event.preventDefault()
			return command
		}
	}
}

const convertToKeyMap = (shortcut) => {
	const keys = shortcut.split("+")
	const keyCode = keys.find((key) => !["ctrl", "alt", "shift", "meta"].includes(key))
	return {
		keyCode: keycodes[keyCode],
		ctrlKey: keys.includes("ctrl"),
		altKey: keys.includes("alt"),
		shiftKey: keys.includes("shift"),
		metaKey: keys.includes("meta"),
	}
}

const getHotKeyCallback = (commands, keyCode, eventKeyModifiers) => {
	return commands.find((command) => {
		const keyMap = command.keyMap
		if (!keyMap) return false

		if (areObjectsEqual(keyMap, { keyCode, ...eventKeyModifiers })) {
			return true
		} else {
			return false
		}
	})
}

const areObjectsEqual = (a, b) => Object.entries(a).every(([key, value]) => b[key] === value)
