# dedup-async

Deduplicate concurrent promise calls by resolving them together.

dedup-async wraps any function that returns promise. Succeeding call to the same function will get a promise that resolves/rejects along with the previous pending promise if any, but not triggering the actual logic.

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

test()                //Prints 'Working...', resolves 0
test()                //No print,            resolves 0
setTimeout(test, 200) //Prints 'Working...', resolves 1
```