export function handlePaste(view, event) {
	const items = (event.clipboardData || event.originalEvent.clipboardData).items
	for (const item of items) {
		if (item.type.indexOf("image") === 0) {
			event.preventDefault()
			const { schema } = view.state
			const reader = new FileReader()

			const image = item.getAsFile()

			reader.onload = async (readerEvent) => {
				const node = schema.nodes.image.create({
					base64: readerEvent.target.result,
					imageData: image,
				})
				const transaction = view.state.tr.replaceSelectionWith(node)
				view.dispatch(transaction)
			}
			reader.readAsDataURL(image)

			return false
		}
	}
	return false
}
