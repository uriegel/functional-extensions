export class AsyncEnumerable<T> {
    constructor(private asyncIterable: AsyncIterable<T>) { }

    static from<T>(enumerablePromise: Promise<T[]>) {
 
        async function* generate(): AsyncIterable<T> {
            const enumerable = await enumerablePromise
            for (let i = 0; i < enumerable.length; i++) 
                yield enumerable[i]
        }
        return new AsyncEnumerable<T>(generate())
    }

    filter(predicate: (t: T)=>boolean): AsyncEnumerable<T> {
        async function* map(asyncIterable: AsyncIterable<T>): AsyncIterable<T> {
            for await (const value of asyncIterable) {
                if (predicate(value))
                    yield value
            }
		}
        return new AsyncEnumerable(map(this.asyncIterable))
    }

    filterNone(): AsyncEnumerable<NonNullable<T>> {
        async function* map(asyncIterable: AsyncIterable<T>): AsyncIterable<NonNullable<T>> {
            for await (const value of asyncIterable) {
                if (value)
                    yield value as NonNullable<T>
            }
		}
        return new AsyncEnumerable(map(this.asyncIterable))
    }

    map<R>(selector: (n: T)=>R) {
        async function* map(asyncIterable: AsyncIterable<T>): AsyncIterable<R> {
            for await (const value of asyncIterable) {
                yield selector(value)
            }
		}
        return new AsyncEnumerable(map(this.asyncIterable))
    }

    bind<R>(selector: (n: T)=>AsyncEnumerable<R>) {
        async function* map(asyncIterable: AsyncIterable<T>): AsyncIterable<R> {
            for await (const value of asyncIterable) {
                for await (const val of selector(value).asyncIterable)
                    yield val
            }
		}
        return new AsyncEnumerable(map(this.asyncIterable))
    }

    take(count: number) {
        async function* map(asyncIterable: AsyncIterable<T>): AsyncIterable<T> {
            for await (const value of asyncIterable) {
                yield value
                if (--count == 0)
                    break
            }
		}
        return new AsyncEnumerable(map(this.asyncIterable))
    }

    async await() {
        const fromAsync = async (source: Iterable<T> | AsyncIterable<T>): Promise<T[]> => {
            const items:T[] = [];
            for await (const item of source) 
              items.push(item)
            return items
        }
        return await fromAsync(this.asyncIterable)
    }

    // bind<R>(selector: (n: T)=>AsyncEnumerable<R>) {
    //     async function* map(asyncIterable: AsyncIterable<T>): AsyncIterator<R> {
    //         for await (const value of asyncIterable) 
    //             yield selector(value)
	// 	}
    //     return map(this.asyncIterable)
    // }
}