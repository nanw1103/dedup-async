const dedupa = require('./index.js')

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