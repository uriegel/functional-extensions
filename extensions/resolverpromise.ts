import { ResolverPromise } from "./index"

export const createResolverPromise = <T>() => {
    let resolve: (t: T)=>void = ()=>{}
    let resolved = false
    const promise = new Promise<T>(res => 
        resolve = t => { 
            resolved = true
            res(t)
        })
    return { promise, resolve, isResolved: ()=>resolved } as ResolverPromise<T>
}
    