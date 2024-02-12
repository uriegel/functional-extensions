import { ResolverPromise, Semaphore } from "./index"
import { createResolverPromise } from "./resolverpromise"

export const createSemaphore = (initialCount: number, maxCount: number): Semaphore => {

    // TODO stack von promises 
    let pars: ResolverPromise<void>[] = []



    const wait = async () => {
        if (initialCount > 0) {
            initialCount--
        } else {
            const par = createResolverPromise<void>()
            pars = [...pars, par]
            await par.promise
        }
    }

    const release = () => {
        initialCount = Math.min(initialCount + 1, maxCount)
        pars.forEach(p => p.resolve())
    }

    return {
        wait,
        release
    }
}