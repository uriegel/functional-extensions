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
