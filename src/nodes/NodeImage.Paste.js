export function handlePaste(view, event) {
	const items = (event.clipboardData || event.originalEvent.clipboardData).items
	for (const item of items) {
		if (item.type.indexOf("image") === 0) {
			event.preventDefault()
			const { schema } = view.state

			const image = item.getAsFile()
			const reader = new FileReader()

			reader.onload = async (readerEvent) => {
				const node = schema.nodes.image.create({
					src: readerEvent.target.result,
					imageData: image,
				})
				const transaction = view.state.tr.replaceSelectionWith(node)
				view.dispatch(transaction)
				/*
				const file = await uploadFunction(image)
				console.log("node", node)
				node.replace({
					"data-id": file.id,
					"data-path": file.path_display,
                })
                */
			}
			reader.readAsDataURL(image)

			return false
		}
	}
	return false
}
