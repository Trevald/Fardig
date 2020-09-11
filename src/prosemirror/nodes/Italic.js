import { Mark } from "tiptap"
import { toggleMark, markInputRule, markPasteRule } from "tiptap-commands"

export default class Italic extends Mark {
	get name() {
		return "em"
	}

	get schema() {
		return {
			parseDOM: [{ tag: "em" }],
			toDOM: () => ["em", 0],
		}
	}

	keys({ type }) {
		return {
			"Mod-i": toggleMark(type),
		}
	}

	commands({ type }) {
		return () => toggleMark(type)
	}

	inputRules({ type }) {
		return [
			markInputRule(/(?:^|[^_])(_([^_]+)_)$/, type),
			markInputRule(/(?:^|[^*])(\*([^*]+)\*)$/, type),
		]
	}

	pasteRules({ type }) {
		return [markPasteRule(/_([^_]+)_/g, type), markPasteRule(/\*([^*]+)\*/g, type)]
	}
}
