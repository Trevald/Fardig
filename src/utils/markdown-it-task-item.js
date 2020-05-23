// Markdown-it plugin to render GitHub-style task lists; see
//
// https://github.com/blog/1375-task-lists-in-gfm-issues-pulls-comments
// https://github.com/blog/1825-task-lists-in-all-markdown-documents

module.exports = function(md) {
	md.core.ruler.after("inline", "app_todo", function(state) {
		var tokens = state.tokens

		for (var i = 0; i < tokens.length; i++) {
			if (!isTodoItem(tokens, i)) {
				continue
			}

			const content = tokens[i].content + ""
			const done = content.charAt(1).toLowerCase() + "" === "x"

			tokens[i - 2].attrs = [["class", "todo-list"]]

			tokens[i - 1].type = "app_todo_open" // = new state.Token("app_todo_open", "p", 0)
			tokens[i - 1].nesting = 1
			tokens[i + 1].nesting = -1

			tokens[i - 1].attrs = [
				["type", "app_todo"],
				["state", done ? "done" : "not started"],
			]
			tokens[i].children[0].content = content.slice(4)
			tokens[i + 1].type = "app_todo_close" // = new state.Token("app_todo_close", "p", 0)
		}

		return true
	})
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
	return token.type === "paragraph_open" || token.type === "app_todo_open"
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
