import Dropbox from 'dropbox';

const CLIENT_ID = 'e3rslpuechz78qp';

// Parses the url and gets the access token if it is in the urls hash
function getAccessTokenFromUrl() {
    return parseQueryString(window.location.hash).access_token;
}

// If the user was just redirected from authenticating, the urls hash will
// contain the access token.
function isAuthenticated() {
    return !!getAccessTokenFromUrl();
}

// Render a list of items to #files
function renderItems(items) {
    console.log(items);
}

export default function dropboxAuth() {
    let dbx;
    if (isAuthenticated()) {
        // showPageSection('authed-section');

        // Create an instance of Dropbox with the access token and use it to
        // fetch and render the files in the users root directory.
        dbx = new Dropbox.Dropbox({ accessToken: getAccessTokenFromUrl() });
        dbx.filesListFolder({path: ''})
        .then(function(response) {
            renderItems(response.entries);
        })
        .catch(function(error) {
            console.error(error);
        });
        return null;
    } else {
        // showPageSection('pre-auth-section');

        // Set the login anchors href using dbx.getAuthenticationUrl()
        dbx = new Dropbox.Dropbox({ clientId: CLIENT_ID });
        var authUrl = dbx.getAuthenticationUrl('http://localhost:8080/auth');
        return authUrl;
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