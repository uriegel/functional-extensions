export { }

declare global {
    interface String {
        /** 
         * Returns a substring after a found char, not including the char 
        */
        substringAfter(startChar: string): string
    
        /**
        * Returns a substring, until a char in the string is found, not including the found char
        */
        substringUntil(endChar: string): string
    
        /**
        * Combination of 'SubstringAfter' and 'SubstringUntil', returning a substring embedded between 'startChar and 'endChar'
        */
        stringBetween(startChar: string, endChar: string): string
    
        lastIndexOfAny(chars: string[]): number

        /**
         * Running a side effect function on this string, returning this string
         * 
         * @param sideEffect Function which is called with this string as parameter as side effect function
         */
        sideEffect(sideEffect: (s: string) => void): string

        /**
         * Parses this string and returns a number if possible othwewise null
         */
        parseInt(): number|null
    }
   
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

// eslint-disable-next-line
String.prototype.substringAfter = function (startChar: string): string {
    const posStart = this?.indexOf(startChar) + 1 ?? -1
    return posStart != -1 && posStart < this.length - 1
    ? this.substring(posStart)
    : ""
}

// eslint-disable-next-line
String.prototype.substringUntil = function (endChar: string): string {
    const posEnd = this?.indexOf(endChar) ?? 0
    return posEnd > 0
    ? this.substring(0, posEnd)
    : this as string ?? ""
}

// eslint-disable-next-line
String.prototype.stringBetween = function (startChar: string, endChar: string): string {
    return this
        ?.substringAfter(startChar)
        ?.substringUntil(endChar)
        ?? "";
}

// eslint-disable-next-line
String.prototype.lastIndexOfAny = function (chars: string[]): number {
    if (chars.length > 0) {
        const res = this.lastIndexOf(chars[0])
        return res != -1
            ? res + 1
            : this.lastIndexOfAny(chars.slice(1))
    } else 
        return -1
}

// eslint-disable-next-line
String.prototype.sideEffect = function (sideEffect: (s: string)=>void): string {
    sideEffect(this as string)
    return this as string
}

// eslint-disable-next-line
String.prototype.parseInt = function (): number|null {
    var result = Number.parseInt(this as string)
    return Number.isNaN(result)
        ? null
        : result
}

