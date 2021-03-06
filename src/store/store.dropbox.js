import {
    getPreferencesProp,
    updatePreferencesProp,
} from "./../utils/preferences";
import { DropboxAuth } from "dropbox";
import Dropbox from "dropbox/src/dropbox";

let ACCESS_TOKEN = getAccessToken();
const CLIENT_ID = "e3rslpuechz78qp";

const AUTH = new DropboxAuth();
AUTH.setAccessToken(ACCESS_TOKEN);
const API = new Dropbox({ auth: AUTH, fetch: window.fetch.bind(window) });

updatePreferencesProp("accessToken", ACCESS_TOKEN);

function getAccessToken() {
    if (process.env.IS_ELECTRON) {
        return (
            getPreferencesProp("accessToken") ||
            parseQueryString(window.location.hash).access_token
        );
    } else {
        return (
            getPreferencesProp("accessToken") ||
            parseQueryString(window.location.hash).access_token
        );
    }
}

const storeDropbox = {
    state: () => {
        return {
            requestedFiles: 0,
            loadedFiles: 0,
            cache: [],
        };
    },

    getters: {
        isAuthenticated: () => {
            return ACCESS_TOKEN !== undefined;
        },

        dropboxAuthLink: () => {
            const dbx = new DropboxAuth({
                clientId: CLIENT_ID,
            });
            return process.env.NODE_ENV === "production"
                ? dbx.getAuthenticationUrl("https://fardig.io/auth")
                : dbx.getAuthenticationUrl("http://localhost:8080/auth");
        },

        requestedFiles: (state) => {
            return state.requestedFiles;
        },

        loadedFiles: (state) => {
            return state.loadedFiles;
        },

        getFromCache: (state) => (key) => {
            const isInCache = state.cache.find((cache) => cache.key === key);
            return isInCache ? isInCache.value : undefined;
        },
    },

    mutations: {
        addRequestedFilesCount: (state) => {
            state.requestedFiles++;
        },

        addLoadedFilesCount: (state) => {
            state.loadedFiles++;
        },

        addToCache: (state, payload) => {
            state.cache.push(payload);
        },
    },

    actions: {
        getEntries() {
            return API.filesListFolder({ path: "" })
                .then(function(response) {
                    return response.result.entries.filter(
                        (file) => file[".tag"] === "file"
                    );
                })
                .catch(function(error) {
                    console.error(error);
                });
        },

        deleteFile(store, payload) {
            return API.filesDeleteV2({ path: payload.id }).then((response) => {
                return response;
            });
        },

        getContents({ commit }, path) {
            commit("addRequestedFilesCount");

            return API.filesDownload({ path })
                .then((response) => {
                    var reader = new FileReader();
                    commit("addLoadedFilesCount");

                    return new Promise((resolve) => {
                        reader.onload = function() {
                            resolve(reader.result);
                        };
                        reader.readAsText(response.result.fileBlob);
                    });
                })
                .catch(function(error) {
                    console.error(error);
                });
        },

        getFile({ getters, commit }, path) {
            const fileFromCache = getters.getFromCache(path);
            if (fileFromCache) {
                return new Promise((resolve) => {
                    resolve(fileFromCache);
                });
            }
            return API.filesDownload({ path }).then((response) => {
                var reader = new FileReader();

                return new Promise((resolve) => {
                    reader.onload = function() {
                        commit("addToCache", {
                            key: path,
                            value: reader.result,
                        });
                        resolve(reader.result);
                    };

                    reader.readAsDataURL(response.result.fileBlob);
                });
            });
        },

        storeContents(store, filesCommitInfo) {
            return API.filesUpload(filesCommitInfo)
                .then((response) => {
                    return response;
                })
                .catch(function(error) {
                    console.error(error);
                });
        },
    },
};

export default storeDropbox;

function parseQueryString(str) {
    var ret = Object.create(null);

    if (typeof str !== "string") {
        return ret;
    }

    str = str.trim().replace(/^(\?|#|&)/, "");

    if (!str) {
        return ret;
    }

    str.split("&").forEach(function(param) {
        var parts = param.replace(/\+/g, " ").split("=");
        // Firefox (pre 40) decodes `%3D` to `=`
        // https://github.com/sindresorhus/query-string/pull/37
        var key = parts.shift();
        var val = parts.length > 0 ? parts.join("=") : undefined;

        key = decodeURIComponent(key);

        // missing `=` should be `null`:
        // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
        val = val === undefined ? null : decodeURIComponent(val);

        if (ret[key] === undefined) {
            ret[key] = val;
        } else if (Array.isArray(ret[key])) {
            ret[key].push(val);
        } else {
            ret[key] = [ret[key], val];
        }
    });

    return ret;
}
