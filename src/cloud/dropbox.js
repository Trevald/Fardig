import Dropbox from 'dropbox';

export default class DropboxApi {

    constructor() {
        this.CLIENT_ID = 'e3rslpuechz78qp';

        if (this.isAuthenticated()) {
            this.ACCESS_TOKEN = this.getAccessTokenFromUrl();
            this.dbx = new Dropbox.Dropbox({ accessToken: this.ACCESS_TOKEN });
        }
    }

    getAuthUrl() {
        this.dbx = new Dropbox.Dropbox({ clientId: this.CLIENT_ID });
        var authUrl = this.dbx.getAuthenticationUrl('http://localhost:8080/auth');
        return authUrl;  
    }

    getAccessTokenFromUrl() {
        return parseQueryString(window.location.hash).access_token;
    }

    isAuthenticated() {
        return !!this.getAccessTokenFromUrl();
    }

    getEntries() {
        return this.dbx.filesListFolder({path: ''})
        .then(function(response) {
            return response.entries;
        })
        .catch(function(error) {
            console.error(error);
        });
    }


    getContents(path) {
        return this.dbx.filesDownload({path})
            .then(response => {
                return response.fileBlob.text();
            })
            .catch(function(error) {
                console.error(error);
            });
    }

    storeContents(filesCommitInfo) {
        return this.dbx.filesUpload(filesCommitInfo)
            .then(response => {
                return response;
            })
            .catch(function(error) {
                console.error(error);
            });
    }

}


function parseQueryString(str) {
    var ret = Object.create(null);

    if (typeof str !== 'string') {
        return ret;
    }

    str = str.trim().replace(/^(\?|#|&)/, '');

    if (!str) {
        return ret;
    }

    str.split('&').forEach(function (param) {
        var parts = param.replace(/\+/g, ' ').split('=');
        // Firefox (pre 40) decodes `%3D` to `=`
        // https://github.com/sindresorhus/query-string/pull/37
        var key = parts.shift();
        var val = parts.length > 0 ? parts.join('=') : undefined;

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