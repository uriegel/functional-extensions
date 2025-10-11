import { ResolverPromise } from "./index.js"

export const createResolverPromise = <T>() => {
    let resolve: (t: T)=>void = ()=>{}
    let reject: (e: Error)=>void = ()=>{}
    let resolved = false
    const promise = new Promise<T>((res, rej) => {
        resolve = t => { 
            resolved = true
            res(t)
        }
        reject = rej
    })
    return { promise, resolve, reject, isResolved: ()=>resolved } as ResolverPromise<T>
}
    