import { getPreferencesProp, updatePreferencesProp } from "./../utils/preferences"

import Dropbox from "dropbox"

const ACCESS_TOKEN =
	getPreferencesProp("accessToken") || parseQueryString(window.location.hash).access_token
const CLIENT_ID = "e3rslpuechz78qp"
const API = new Dropbox.Dropbox({ accessToken: ACCESS_TOKEN, fetch: fetch })

updatePreferencesProp("accessToken", ACCESS_TOKEN)

const storeDropbox = {
	state: () => {
		return {
			requestedFiles: 0,
			loadedFiles: 0,
		}
	},

	getters: {
		isAuthenticated: () => {
			return ACCESS_TOKEN !== undefined
		},

		dropboxAuthLink: () => {
			const dbx = new Dropbox.Dropbox({ clientId: CLIENT_ID, fetch: fetch })
			return process.env.NODE_ENV === "production"
				? dbx.getAuthenticationUrl("https://fardig.io/auth")
				: dbx.getAuthenticationUrl("http://localhost:8080/auth")
		},

		requestedFiles: (state) => {
			return state.requestedFiles
		},

		loadedFiles: (state) => {
			return state.loadedFiles
		},
	},

	mutations: {
		addRequestedFilesCount: (state) => {
			state.requestedFiles++
		},

		addLoadedFilesCount: (state) => {
			state.loadedFiles++
		},
	},

	actions: {
		getEntries() {
			return API.filesListFolder({ path: "" })
				.then(function(response) {
					return response.entries.filter((file) => file[".tag"] === "file")
				})
				.catch(function(error) {
					console.error(error)
				})
		},

		getContents({ commit, getters }, path) {
			commit("addRequestedFilesCount")
			console.log("load", path, getters.requestedFiles)

			return API.filesDownload({ path })
				.then((response) => {
					var reader = new FileReader()
					commit("addLoadedFilesCount")
					console.log("loaded", path, getters.loadedFiles)

					return new Promise((resolve) => {
						reader.onload = function() {
							console.log("onload done!", path)
							resolve(reader.result)
						}
						reader.readAsText(response.fileBlob)
					})
				})
				.catch(function(error) {
					console.error(error)
				})
		},

		storeContents(store, filesCommitInfo) {
			return API.filesUpload(filesCommitInfo)
				.then((response) => {
					return response
				})
				.catch(function(error) {
					console.error(error)
				})
		},
	},
}

export default storeDropbox

function parseQueryString(str) {
	var ret = Object.create(null)

	if (typeof str !== "string") {
		return ret
	}

	str = str.trim().replace(/^(\?|#|&)/, "")

	if (!str) {
		return ret
	}

	str.split("&").forEach(function(param) {
		var parts = param.replace(/\+/g, " ").split("=")
		// Firefox (pre 40) decodes `%3D` to `=`
		// https://github.com/sindresorhus/query-string/pull/37
		var key = parts.shift()
		var val = parts.length > 0 ? parts.join("=") : undefined

		key = decodeURIComponent(key)

		// missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		val = val === undefined ? null : decodeURIComponent(val)

		if (ret[key] === undefined) {
			ret[key] = val
		} else if (Array.isArray(ret[key])) {
			ret[key].push(val)
		} else {
			ret[key] = [ret[key], val]
		}
	})

	return ret
}