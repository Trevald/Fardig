// https://gist.github.com/slava-vishnyakov/16076dff1a77ddaca93c4bccd4ec4521

import { Node, Plugin } from "tiptap"
import { nodeInputRule } from "tiptap-commands"
import { dropAndUpload } from "./NodeImage.DragAndDrop"
import { handlePaste } from "./NodeImage.Paste"

import AppImage from "./NodeImage.View"

/**
 * Matches following attributes in Markdown-typed image: [, alt, src, title]
 *
 * Example:
 * ![Lorem](image.jpg) -> [, "Lorem", "image.jpg"]
 * ![](image.jpg "Ipsum") -> [, "", "image.jpg", "Ipsum"]
 * ![Lorem](image.jpg "Ipsum") -> [, "Lorem", "image.jpg", "Ipsum"]
 */
const IMAGE_INPUT_REGEX = /!\[(.+|:?)\]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/

export default class Image extends Node {
	constructor(name, parent, uploadFunc = null) {
		super(name, parent)
		this.uploadFunc = uploadFunc
	}

	get name() {
		return "image"
	}

	get view() {
		return AppImage
	}

	get schema() {
		return {
			attrs: {
				base64: {
					default: null,
				},
				alt: {
					default: "Image",
				},
				title: {
					default: null,
				},
				id: {
					default: null,
				},
				path: {
					default: null,
				},
				imageData: {
					default: null,
				},
				src: {
					default: null,
				},
			},
			inline: true,
			group: "inline",
			draggable: true,
			parseDOM: [
				{
					tag: "img[src]",
					getAttrs: (dom) => ({
						title: dom.getAttribute("title"),
						alt: dom.getAttribute("alt"),
						id: dom.getAttribute("data-id"),
						path: dom.getAttribute("data-path"),
						src: dom.getAttribute("data-path"),
					}),
				},
			],
			toDOM: (node) => {
				return [
					"img",
					{
						"data-id": node.attrs.id,
						"data-path": node.attrs.path,
						title: node.attrs.title,
						alt: node.attrs.alt,
						src: node.attrs.src,
					},
				]
			},
		}
	}

	commands({ type }) {
		return (attrs) => (state, dispatch) => {
			const { selection } = state
			const position = selection.$cursor ? selection.$cursor.pos : selection.$to.pos
			const node = type.create(attrs)
			const transaction = state.tr.insert(position, node)
			dispatch(transaction)
		}
	}

	inputRules({ type }) {
		return [
			nodeInputRule(IMAGE_INPUT_REGEX, type, (match) => {
				const [, alt, path, title] = match
				return {
					path,
					alt,
					title,
				}
			}),
		]
	}

	get plugins() {
		const uploadFunction = this.uploadFunc
		return [
			new Plugin({
				props: {
					handleDOMEvents: {
						drop: (view, event) => {
							return dropAndUpload(view, event, uploadFunction)
						},
					},

					handlePaste: (view, event) => {
						return handlePaste(view, event)
					},
				},
			}),
		]
	}
}
