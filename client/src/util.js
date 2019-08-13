/**
 * Resolves a promise within ms or rejects
 * @param {Promise} promise the promise to wait on
 * @param {number} ms ms until timeout
 */
export async function promiseWithTimeout(promise, ms) {
  // Create a promise that rejects in <ms> milliseconds
  const timeout = new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id)
      reject(new Error('Timed out after ' + ms + 'ms.'))
    }, ms)
  })

  // Returns a race between our timeout and the passed in promise
  // The first promise to resolve/reject will be returned
  return Promise.race([
    promise,
    timeout,
  ])
}


/**
 * A deferred Promise, giving you the ability to call resolve/reject when you wish.
 * 
 * This is an old JS construct called Deferred [1], since obseleted, but is quite useful to
 * structure async control flow with timeouts. eg.
 *
 * 	let dfd = new Deffered()
 * 	eventEmitter.on('event', data => {
 * 		dfd.resolve(data)
 * 	})
 *
 * 	await Promise.race([
 * 		dfd,
 * 		new Promise((res,rej) => setTimeout(rej, 2000))
 * 	]
 * [1]: https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Deferred
 */
export class Deferred {
   resolve = null
   reject = null
  
   constructor() {
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
   }
}