export function dropAndUpload(view, event, uploadFunction) {
	if (!shouldRun(event)) {
		return
	}
	event.preventDefault()

	const { schema } = view.state
	const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })

	const images = getImages(event)

	images.forEach(async (image) => {
		if (uploadFunction) {
			const node = schema.nodes.image.create({
				src: await uploadFunction(image),
			})
			const transaction = view.state.tr.insert(coordinates.pos, node)
			view.dispatch(transaction)
		}
	})
}

function getImages(event) {
	return Array.from(event.dataTransfer.files).filter((file) => /image/i.test(file.type))
}

function hasFiles(event) {
	return event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length
}

function hasImages(event) {
	return getImages(event).length > 0
}

function shouldRun(event) {
	if (!hasFiles(event)) {
		return false
	} else if (!hasImages(event)) {
		return false
	} else {
		return true
	}
}
