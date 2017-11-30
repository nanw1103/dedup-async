# dedup-async

Deduplicate concurrent promise calls by resolving them together.

dedup-async wraps any function that returns promise. Succeeding call to the same function will get a promise that resolves/rejects along with the previous pending promise if any, but does not trigger the actual logic.

```javascript
const dedupa = require('dedup-async')

let evil
let n = 0

function task() {
	return new Promise((resolve, reject) => {
		if (evil)
			throw 'Duplicated concurrent call!'
		evil = true
    
		setTimeout(() => {
			console.log('Working...')
			evil = false
			resolve(n++)
		}, 100)
	})
}

function test() {
	dedupa(task)
		.then (d => console.log('Finish:', d))
		.catch(e => console.log('Error:', e))
}

test()                //Prints 'Working...', resolves 0. (Starts a new pending promise)
test()                //No print,            resolves 0. (Resolves together with the previous promise)
test()                //No print,            resolves 0. (Resolves together with the previous promise)
setTimeout(test, 200) //Prints 'Working...', resolves 1. (Starts a new pending promise since the previous one has completed)
```
