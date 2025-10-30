/**
 * Calling a function. If the function throws an exception, onError is called to react to the exception e. 
 * If it can be corrected, onError returns, otherwise onError must throw e. If it does not fail, action is called again
 * @param action The action which will be called, and again, if onError does not fail
 * @param onError If action throws an error, this function is called. You can throw the original error, or you can solve the problem, then it retries. 
 * If you call 'cancel()' and throw the original error, t will not retry any more
 * @param retryCount Number of trials, 1 is default
 * @returns a result of type T
 */
export const retryOnError = <T>(action: () => T, onError: (e: unknown, cancel: ()=>void) => boolean, retryCount = 1) => {
    for (let n = 0; n <= retryCount; n++) {
        try {
            return action()
        } catch (e) {
            let cancel = false
            try {
                onError(e, () => { cancel = true })
            } catch (e) {
                if (cancel || n == retryCount - 1)
                    throw e
            }
        }
    }
    throw "too many iterations"
}

/**
 * Calling a function. If the function throws an exception, onError is called to react to the exception e. 
 * If it can be corrected, onError returns, otherwise onError must throw e. If it does not fail, action is called again
 * @param action The action which will be called, and again, if onError does not fail
 * @param onError If action throws an error, this function is called. You can throw the original error, or you can solve the problem, then it retries. 
 * If you call 'cancel()' and throw the original error, t will not retry any more
 * @param retryCount Number of trials, 1 is default
 * @returns a result of type T
 */
export const retryOnErrorAsync = async <T>(action: () => Promise<T>, onError: (e: unknown, cancel: ()=>void)=>Promise<void>, retryCount = 1) => {
    for (let n = 0; n <= retryCount; n++) {
        try {
            return await action()
        } catch (e) {
            let cancel = false
            try {
                await onError(e, () => cancel = true)
            } catch (e) {
                if (cancel || n == retryCount - 1)
                    throw e
            }
        }
    }
    throw "too many iterations"
}