export abstract class Result<T, E> {
    abstract map<U>(func: (value: T) => U): Result<U, E>
    abstract bind<U>(func: (value: T) => Result<U, E>): Result<U, E>
    abstract match<TR>(
        okFunc: (value: T) => TR,
        errFunc: (value: E) => TR): TR
    abstract whenError(errFunc: (value: E) => void): void
        
    static parseJSON<T, E>(json: string): Result<T, E> {
        const obj = JSON.parse(json)
        return obj.ok
        ? new Ok<T, E>(obj.ok as T)
        : new Err<T, E>(obj.error as E)
    }
}
  
export class Ok<T, E> extends Result<T, E> {
    constructor(private ok: T) { super() }

    map<U>(func: (value: T) => U): Result<U, E> {
        return new Ok(func(this.ok))
    }
    
    bind<U>(func: (value: T) => Result<U, E>): Result<U, E> {
        return func(this.ok)
    }

    match<TR>(okFunc: (value: T) => TR, _: (_: E) => TR): TR {
        return okFunc(this.ok)
    }
    
    whenError(_: (value: E) => void): void {}

    // toJSON(): string {
    //     return "Hello"
    // }
}

export class Err<T, E> extends Result<T, E> {
    constructor(private error: E) { super() }

    map<U>(_: (value: T) => U): Result<U, E> {
        return this.error as Result<U, E>
    }

    bind<U>(_: (value: T) => Result<U, E>): Result<U, E> {
        return this.error as Result<U, E>
    }

    match<TR>(_: (_: T) => TR, errFunc: (e: E) => TR): TR {
        return errFunc(this.error)
    }
    
    whenError(errFunc: (value: E) => void): void {
        errFunc(this.error)
    }
}


