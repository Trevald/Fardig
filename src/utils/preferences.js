const LOCAL_STORAGE_KEY = "USER_PREFERENCES"

export function updatePreferencesProp(propName, propValue) {
	console.log("updatePreferencesProp", propName, propValue)
	const preferences = hasPreferences() ? getPreferences() : {}
	preferences[propName] = propValue
	savePreferences(preferences)
}

export function getPreferencesProp(propName, fallback) {
	const preferences = hasPreferences() ? getPreferences() : {}

	return preferences[propName] !== undefined ? preferences[propName] : fallback
}

function savePreferences(preferences) {
	setLocalStorageData(LOCAL_STORAGE_KEY, preferences)
}

function getPreferences() {
	return getLocalStorageData(LOCAL_STORAGE_KEY)
}

function hasPreferences() {
	return getLocalStorageData(LOCAL_STORAGE_KEY) !== undefined
}

function getLocalStorageData(key) {
	const localStorageData = localStorage.getItem(key)

	return localStorageData ? JSON.parse(localStorageData) : undefined
}

function setLocalStorageData(key, data) {
	const jsonData = JSON.stringify(data)

	localStorage.setItem(key, jsonData)
}
