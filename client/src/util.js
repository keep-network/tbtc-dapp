/**
 * Resolves a promise within ms or rejects
 * @param {*} promise the promise to wait on
 * @param {*} ms ms until timeout
 */
export async function promiseWithTimeout(promise, ms) {
  // Create a promise that rejects in <ms> milliseconds
  const timeout = new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id)
      reject('Timed out after ' + ms + 'ms.')
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
 * A bare-bones implementation of the Deferred construct [1]
 * This is an old JS construct that was obseleted, but is quite useful to
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
 *
 * [1]: https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Deferred
 */
export function Deferred() {
  /* A method to resolve the associated Promise with the value passed.
	* If the promise is already settled it does nothing.
	*
	* @param {anything} value : This value is used to resolve the promise
	* If the value is a Promise then the associated promise assumes the state
	* of Promise passed as value.
	*/
  this.resolve = null

  /* A method to reject the assocaited Promise with the value passed.
	* If the promise is already settled it does nothing.
	*
	* @param {anything} reason: The reason for the rejection of the Promise.
	* Generally its an Error object. If however a Promise is passed, then the Promise
	* itself will be the reason for rejection no matter the state of the Promise.
	*/
  this.reject = null

  /* A newly created Promise object.
		* Initially in pending state.
		*/
  this.promise = new Promise(function(resolve, reject) {
    this.resolve = resolve
    this.reject = reject
  }.bind(this))
  Object.freeze(this)
}
