// Markdown-it plugin to render GitHub-style task lists; see
//
// https://github.com/blog/1375-task-lists-in-gfm-issues-pulls-comments
// https://github.com/blog/1825-task-lists-in-all-markdown-documents

module.exports = function(md) {
	md.core.ruler.after("inline", "todo_item", function(state) {
		var tokens = state.tokens

		for (var i = 0; i < tokens.length; i++) {
			if (!isTodoItem(tokens, i)) {
				continue
			}

			const content = tokens[i].content + ""
			const done = content.charAt(1).toLowerCase() + "" === "x"

			tokens[i - 1].type = "todo_item_open" // = new state.Token("app_todo_open", "p", 0)

			tokens[i - 1].attrs = [
				["data-type", "todo_item"],
				["data-status", done ? "done" : "not started"],
			]
			tokens[i].children[0].content = content.slice(4)
			tokens[i + 1].type = "todo_item_close" // = new state.Token("app_todo_close", "p", 0)
			tokens.splice(i + 2, 1)
			tokens.splice(i - 2, 1)

			if (!parentListIsTodo(tokens, i)) {
				const parentIndexes = getParentList(tokens, i)
				tokens[parentIndexes.open].type = "todo_list_open"
				tokens[parentIndexes.close].type = "todo_list_close"
			}
		}

		return true
	})
}

function parentListIsTodo(tokens, index) {
	let isTodoList
	for (let i = index; i > 0; i--) {
		if (tokens[i].type === "bullet_list_open") {
			isTodoList = false
			break
		} else if (tokens[i].type === "todo_list_open") {
			isTodoList = true
			break
		}
	}
	return isTodoList
}

function getParentList(tokens, index) {
	let parentOpenIndex
	for (let i = index; i > 0; i--) {
		if (tokens[i].type === "bullet_list_open" || tokens[i].type === "todo_list_open") {
			parentOpenIndex = i
			break
		}
	}

	let parentCloseIndex
	for (let i = parentOpenIndex; i < tokens.length; i++) {
		if (tokens[i].type === "bullet_list_close" || tokens[i].type === "todo_list_close") {
			parentCloseIndex = i
			break
		}
	}

	return {
		open: parentOpenIndex,
		close: parentCloseIndex,
	}
}

function isTodoItem(tokens, index) {
	return (
		isInline(tokens[index]) &&
		isParagraph(tokens[index - 1]) &&
		isListItem(tokens[index - 2]) &&
		startsWithTodoMarkdown(tokens[index])
	)
}

function isInline(token) {
	return token.type === "inline"
}
function isParagraph(token) {
	return token.type === "paragraph_open" || token.type === "todo_item_open"
}

function isListItem(token) {
	return token.type === "list_item_open"
}

function startsWithTodoMarkdown(token) {
	// leading whitespace in a list item is already trimmed off by markdown-it
	return (
		token.content.indexOf("[ ] ") === 0 ||
		token.content.indexOf("[x] ") === 0 ||
		token.content.indexOf("[X] ") === 0
	)
}
