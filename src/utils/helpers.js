export function generateID() {
	return (
		"_" +
		Math.random()
			.toString(36)
			.substr(2, 9)
	)
}

export function deleteFromArray(items, itemToRemove, key) {
	const index = items.findIndex((item) => item[key] === itemToRemove[key])
	if (index !== -1) {
		items.splice(index, 1)
		return items
	} else {
		return false
	}
}
