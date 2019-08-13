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

