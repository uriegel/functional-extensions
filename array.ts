export { }

declare global {
    interface Array<T> {
        /**
         * Running a side effect function on every member, returning this array
         * 
         * @param sideEffect Function which is called with every member as parameter as side effect function
         */
        sideEffectForEach(sideEffect: (t: T) => void): T[]
        
        /**
         * Functionally inserts a T t to this array leaving the original array untouched and returns a new array
         * 
         * @param index Position at which the element is inserted
         * @param t Element to insert
         */
        insert(index: number, t: T): T[]

        /**
         * Functionally appaned a T t to this array leaving the original array untouched and returns a new array
         * 
         * @param t Element to insert
         */
        append(t: T): T[]

        /**
         * Request if an element is contained in the array
         * @param t Element to check
         */
        contains(t: T): boolean
    }
}

// eslint-disable-next-line
Array.prototype.sideEffectForEach = function<T> (sideEffect: (t: T)=>void): T[] {
    this.forEach(sideEffect)
    return this 
}

// eslint-disable-next-line
Array.prototype.insert = function<T> (index: number, t: T): T[] {
    return [...this.slice(0, index),
        t,
        ...this.slice(index)
    ]
}

// eslint-disable-next-line
Array.prototype.append = function<T> (t: T): T[] {
    return [...this, t]
}

// eslint-disable-next-line
Array.prototype.contains = function <T>(t: T): boolean {
    return this.find(n => n === t)
}
