/**
 * Calling a function. If the function throws an exception, onError is called to react to the exception e. 
 * If it can be corrected, onError returns, otherwise onError must throw e. If it does not fail, action is called again
 * @param action The action which will be called, and again, if onError does not fail
 * @param onError If action throws an error, this function is called
 * @returns a result of type T
 */
export const retryOnError = <T>(action: () => T, onError: (e: unknown) => void) => {
    try {
        return action()
    } catch (e) {
        onError(e)
        return action()
    }
}

/**
 * Calling a function. If the function throws an exception, onError is called to react to the exception e. 
 * If it can be corrected, onError returns, otherwise onError must throw e. If it does not fail, action is called again
 * @param action The action which will be called, and again, if onError does not fail
 * @param onError If action throws an error, this function is called
 * @returns a result of type T
 */
export const retryOnErrorAsync = async <T>(action: () => Promise<T>, onError: (e: unknown)=>Promise<void>) => {
    try {
        return await action()
    } catch (e) {
        await onError(e)
        return await action()
    }
}