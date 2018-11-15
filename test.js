const dedupa = require('./index.js')

let n = 0

function task() {
	return new Promise(resolve => {
   
		setTimeout(() => {
			console.log('Working...')
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