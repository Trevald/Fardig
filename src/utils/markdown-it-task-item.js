// Markdown-it plugin to render GitHub-style task lists; see
//
// https://github.com/blog/1375-task-lists-in-gfm-issues-pulls-comments
// https://github.com/blog/1825-task-lists-in-all-markdown-documents

module.exports = function(md) {
	md.core.ruler.after("inline", "app_todo", function(state) {
		var tokens = state.tokens

		for (var i = 0; i < tokens.length; i++) {
			if (isTodoItem(tokens, i)) {
				tokens[i - 1] = new state.Token("app_todo_open", "div", 0)
				tokens[i - 1].block = true
				tokens[i - 1].attrs = [
					["type", "app_todo"],
					[
						"state",
						tokens[i].content.charAt(1).toLowerCase() === "x"
							? "done"
							: "not started",
					],
				]
				tokens[i + 1] = new state.Token("app_todo_close", "div", 0)
			}
		}
		// console.log("tokens", tokens)
		return true
	})
}

function isTodoItem(tokens, index) {
	return (
		isInline(tokens[index]) &&
		isParagraph(tokens[index - 1]) &&
		startsWithTodoMarkdown(tokens[index])
	)
}

/*
function todoify(token, TokenConstructor) {
	token.children.unshift(new TokenConstructor("paragraph_open", "div", 0))
	// token.children[1].content = token.children[1].content.slice(3)
	// token.content = token.content.slice(3)
	token.children.push(new TokenConstructor("paragraph_close", "div", 0))
}
*/

function isInline(token) {
	return token.type === "inline"
}
function isParagraph(token) {
	return token.type === "paragraph_open"
}

function startsWithTodoMarkdown(token) {
	// leading whitespace in a list item is already trimmed off by markdown-it
	return (
		token.content.indexOf("[ ] ") === 0 ||
		token.content.indexOf("[x] ") === 0 ||
		token.content.indexOf("[X] ") === 0
	)
}
