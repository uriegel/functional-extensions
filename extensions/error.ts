/**
 * Calling a function. If the function throws an exception, onError is called to react to the exception e. 
 * If it can be corrected, onError returns, otherwise onError must throw e. If it does not fail, action is called again
 * @param action The action which will be called, and again, if onError does not fail
 * @param onError If action throws an error, this function is called
 * @param retryCount Number of trials, 1 is default
 * @returns a result of type T
 */
export const retryOnError = <T>(action: () => T, onError: (e: unknown) => void, retryCount = 1) => {
    for (let n = 0; n <= retryCount; n++) {
        try {
            return action()
        } catch (e) {
            if (n == retryCount)
                throw e
            onError(e)
        }
        throw "too many iterations"
    }
}

/**
 * Calling a function. If the function throws an exception, onError is called to react to the exception e. 
 * If it can be corrected, onError returns, otherwise onError must throw e. If it does not fail, action is called again
 * @param action The action which will be called, and again, if onError does not fail
 * @param onError If action throws an error, this function is called
 * @param retryCount Number of trials, 1 is default
 * @returns a result of type T
 */
export const retryOnErrorAsync = async <T>(action: () => Promise<T>, onError: (e: unknown)=>Promise<void>, retryCount = 1) => {
    for (let n = 0; n <= retryCount; n++) {
        try {
            return await action()
        } catch (e) {
            if (n == retryCount)
                throw e
            await onError(e)
        }
    }
    throw "too many iterations"
}