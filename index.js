'use strict'

class PromiseHolder {	
	async promise() {
		let me = this
		return new Promise((resolve, reject) => {
			me.resolve = resolve
			me.reject = reject
		})
	}
	
	onResolve(data) {
		this.resolve(data)
	}
	
	onReject(err) {
		this.reject(err)
	}
}

class DedupAsync {
	constructor(task) {
		if (typeof task !== 'function')
			throw "DedupAsync: incorrect c'tor argument. Expect function, but: " + typeof task
		this.task = task
		this.callbacks = []
	}
	
	async run(me) {
		if (this.callbacks.length === 0) {
			process.nextTick(() => {
				try {
					let ret = this.task.apply(me)
					if (!ret.then || typeof ret.then !== 'function')
						this.onResolve(ret)
					else
						ret.then(d => this.onResolve(d)).catch(e => this.onReject(e))
				} catch (e) {
					this.onReject(e)
				}				
			})
		}
		let ph = new PromiseHolder()
		this.callbacks.push(ph)
		return ph.promise()
	}
	
	onResolve(data) {
		this.callbacks.forEach(p => p.onResolve(data))
		this.callbacks = []
	}
	
	onReject(err) {
		this.callbacks.forEach(p => p.onReject(err))
		this.callbacks = []
	}
}

module.exports = (impl, THIS) => {
	if (!impl._dedupasync)
		Object.defineProperty(impl, '_dedupasync', {value: new DedupAsync(impl)})
	return impl._dedupasync.run(THIS)
}