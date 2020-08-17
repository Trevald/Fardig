// Markdown-it plugin to render GitHub-style task lists; see
//
// https://github.com/blog/1375-task-lists-in-gfm-issues-pulls-comments
// https://github.com/blog/1825-task-lists-in-all-markdown-documents

module.exports = function(md) {
	md.core.ruler.after("inline", "tag", function(state) {
		var tokens = state.tokens

		for (var i = 0; i < tokens.length; i++) {
			if (!isTag(tokens, i)) {
				continue
			}
			console.log("mi", tokens[i])
			const content = tokens[i].content + ""
			const label = content.substring(1, content.length)
			tokens[i].type = "tag"
			tokens[i].attrs = [
				["data-id", label],
				["data-label", label],
				["data-type", "tag"],
			]
			tokens[i].children[0].content = content
		}

		return true
	})
}

function isTag(tokens, index) {
	return tokens[index].content.charAt(0) === "#"
}
