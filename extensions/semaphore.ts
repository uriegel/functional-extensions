import { ResolverPromise, Semaphore } from "./index.js"
import { createResolverPromise } from "./resolverpromise.js"

export const createSemaphore = (initialCount: number, maxCount: number): Semaphore => {

    const resolverPromises: ResolverPromise<void>[] = []

    const wait = async () => {
        if (initialCount > 0) {
            initialCount--
        } else {
            const resolverPromise = createResolverPromise<void>()
            resolverPromises.push(resolverPromise)
            await resolverPromise.promise
        }
    }

    const release = () => {
        initialCount = Math.min(initialCount + 1, maxCount)
        resolverPromises.shift()?.resolve()
    }

    return {
        wait,
        release
    }
}