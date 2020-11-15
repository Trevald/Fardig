class Confirm {
    constructor() {
        this._isActive = false;
        this._promise = undefined;

        this.confirm = (text) => {
            this._isActive = true;
            this._text = text;

            this._promise = new Promise((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;
            });
            return this._promise;
        };

        this.answer = (value) => {
            this._isActive = false;
            switch (value) {
                case true:
                    this.resolve(value);
                    break;
                default:
                    this.reject(value);
                    break;
            }
        };
    }

    get isActive() {
        return this._isActive;
    }

    get text() {
        return this._text || "Are you sure?";
    }
}

const GenieConfirm = {
    install(vue, args = {}) {
        if (this.intalled) {
            return;
        }

        // Set up object
        this.installed = true;
        this.params = args;
        this.name = "genieConfirm";
        const confirm = vue.observable(new Confirm());

        vue.prototype["$" + this.name] = confirm;
        vue[this.name] = confirm;
    },
};

export default GenieConfirm;
