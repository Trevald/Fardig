/**
 * Represents a fakeProgress
 * https://github.com/piercus/fake-progress
 * @constructor
 * @param {object} options - options of the contructor
 * @param {object} [options.timeConstant=1000] - the timeConstant in milliseconds (see https://en.wikipedia.org/wiki/Time_constant)
 * @param {object} [options.autoStart=false] - if true then the progress auto start
 */

export class FakeProgress {
	constructor(opts) {
		if (!opts) {
			opts = {}
		}

		this.timeConstant = opts.timeConstant || 1000
		this.progress = 0
		this._running = false
		this._intervalFrequency = 100
		this.autoStart = opts.autoStart || false
		this.parent = opts.parent
		this.parentStart = opts.parentStart
		this.parentEnd = opts.parentEnd
		if (this.autoStart) {
			this.start()
		}
	}

	start() {
		this._time = 0
		this._intervalId = setInterval(this._onInterval.bind(this), this._intervalFrequency)
	}

	_onInterval() {
		this._time += this._intervalFrequency
		this.setProgress(1 - Math.exp((-1 * this._time) / this.timeConstant))
	}

	end() {
		this.stop()
		this.setProgress(1)
	}
	stop() {
		clearInterval(this._intervalId)
		this._intervalId = null
	}

	setProgress(progress) {
		this.progress = progress
		if (this.parent) {
			this.parent.setProgress(
				(this.parentEnd - this.parentStart) * this.progress + this.parentStart
			)
		}
	}
}
