const LOCAL_STORAGE_KEY = "USER_PREFERENCES";

export default class UserService {

    constructor() {
        if (this.hasPrefs()) {
            this.loadPreferences()
        } else {
            this.setDefaultPreferences();
        }
    }

    setDefaultPreferences() {
        return {
            activeFile: undefined, 
            openFiles: new Set()
        }
    }

    hasPrefs() {
        return this.getLocalStorageData(LOCAL_STORAGE_KEY) !== null;
    }

    loadPreferences() {
        const prefs = this.getLocalStorageData(LOCAL_STORAGE_KEY);
        this.openFiles = typeof(prefs?.openFiles) === "object" ? new Set(prefs.openFiles) : new Set();
        this.activeFile = prefs?.activeFile;
    }

    updatePrefs(data) {
        this.activeFile = data.activeFile.id
        this.openFiles = Array.from(data.openFiles).map( file => file.id)
        this.savePrefs()
    }

    savePrefs() {
        const data = {
            activeFile: this.activeFile,
            openFiles: this.openFiles
        }
        this.setLocalStorageData(LOCAL_STORAGE_KEY, data);
    }

    getLocalStorageData(key) {
        const localStorageData = localStorage.getItem(key);
        
        return localStorageData ? JSON.parse(localStorageData) : undefined;
    }

    setLocalStorageData(key, data) {
        const jsonData = JSON.stringify(data);

        localStorage.setItem(key, jsonData)
    }

}