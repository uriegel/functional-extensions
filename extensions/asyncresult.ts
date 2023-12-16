import { Err, Ok, Result } from "./result";

export class AsyncResult<T, E> {
    constructor(private resultTask: Promise<Result<T, E>>) { }
    
    static ToAsyncResult<T, E>(result: Result<T, E>): AsyncResult<T, E> {
        return new AsyncResult<T, E>(new Promise<Result<T, E>>(res => res(result)))
    }

    toResult(): Promise<Result<T, E>> {
        return this.resultTask
    }

    map<U>(func: (value: T) => U): AsyncResult<U, E> {
        return new AsyncResult(this.resultTask.map(r => r.map(r => func(r))))
    }
    mapAsync<U>(func: (value: T) => Promise<U>): AsyncResult<U, E> {
        return new AsyncResult(
            new Promise<Result<U, E>>(res => this.resultTask.map(r => r
                .whenError(e => res(new Err<U, E>(e)))
                .map(r => func(r)
                .then(u => res(new Ok<U, E>(u)))))))
    }
    bind<U>(func: (value: T) => Result<U, E>): AsyncResult<U, E> {
        return new AsyncResult(this.resultTask.map(r => r.bind(r => func(r))))
    }
    // bindAsync<U>(func: (value: T) => Promise<Result<U, E>>): AsyncResult<U, E> {
    //     return new AsyncResult(
    //         new Promise<Result<U, E>>(res => this.resultTask.map(r => r.bind(r => func(r).then(u => res(u))))))
    // }
}