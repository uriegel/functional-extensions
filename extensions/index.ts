export { }
import { AsyncResult } from "./asyncresult"
import { AsyncEnumerable } from "./asyncenumerable"
import { jsonPost, setBaseUrl } from "./requests"
import { Result, Err, Ok } from "./result"
import { Resetter } from "./Resetter"
import { RefCell } from "./refcell"
import { memoize, memoizeAsync } from "./memoization"
import { createResolverPromise } from "./resolverpromise"
import { createSemaphore } from "./semaphore"

export interface ErrorType {
    status: number
    statusText: string
}

export type Semaphore = {
    wait: ()=>Promise<void>
    release: ()=>void
}

export type ResolverPromise<T> = {
    promise: Promise<T>
    resolve: (t: T)=>void
    reject: (e: Error)=>void
    isResolved: ()=>boolean
}

export type Nothing = Record<string, never>

export const nothing: Nothing = {}

type Dictionary<Key extends keyof any, Value> = {
    [key in Key]: Value
}

/**
 * Returns a dictionary from an array of key value pairs
 * 
 * @param arr array of key value pairs
 */
export function mergeToDictionary<K extends keyof any, T>(arr: { key: K, value: T }[]): Dictionary<K, T> {
    const dictionary: Dictionary<K, T> = {} as Dictionary<K, T>
    arr.forEach(n => dictionary[n.key] = n.value)
    return dictionary
}

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
         * Functionally changes a T t in this array leaving the original array untouched and returns a new array
         * 
         * @param index Position at which the to changed element is 
         * @param t Element to change
         */
        change(index: number, t: T): T[]

        /**
         * Functionally appends a T t to this array leaving the original array untouched and returns a new array
         * 
         * @param t Element to insert
         */
        append(t: T): T[]

        /**
         * Request if an element is contained in the array
         * @param t Element to check
         */
        contains(t: T): boolean

        /**
         * returns a distinct array, removing duplicate values
         */
        distinct(): T[] 

        /**
         * filters elements which are null or undefined
         */
        filterNone(): NonNullable<T>[] 
        
        /**
         * Like LINQ Take: takes <count> items from the array
         * @param count 
         */
        take(count: number): T[]

        /**
         * Like LINQ Skip: skips <count> items from the array
         * @param count 
         */
        skip(count: number): T[]

        /**
         * Returns the difference between this array and the array arr
         * @param arr the array containing the elements to substruct
         */
        diff(arr: T[]): T[]

        /**
         * Returns the array's maximum
         * @param mapNumber function to get a value from each element to determine the maximum
         */
        max(mapNumber: (t: T)=>number): number

        /**
         * Returns the array's minimum
         * @param mapNumber function to get a value from each element to determine the minimum
         */
        min(mapNumber: (t: T)=>number): number
    }

    interface Number {
        /**
         * returns as string interpretation of the byte count representated by this
         */
        byteCountToString(): string
    }

    interface Date { 
        /**
         * returns a Date not containing the milliseconds
         */
        removeMilliseconds(): Date 
    }

    interface Promise<T> { 
        map<U>(func: (value: T) => U): Promise<U>
        bind<U>(func: (value: T) => Promise<U>): Promise<U>
        pipe<U>(adapter: (value: Promise<T>)=>U): U
    }
}

String.prototype.substringAfter = function (startChar: string): string {
    const posStart = (this?.indexOf(startChar) ?? -2) + 1 
    return posStart != -1 && posStart < this.length - 1
    ? this.substring(posStart)
    : ""
}

String.prototype.substringUntil = function (endChar: string): string {
    const posEnd = this?.indexOf(endChar) ?? 0
    return posEnd > 0
    ? this.substring(0, posEnd)
    : this as string ?? ""
}

String.prototype.stringBetween = function (startChar: string, endChar: string): string {
    return this
        ?.substringAfter(startChar)
        ?.substringUntil(endChar)
        ?? "";
}

String.prototype.lastIndexOfAny = function (chars: string[]): number {
    if (chars.length > 0) {
        const res = this.lastIndexOf(chars[0])
        return res != -1
            ? res + 1
            : this.lastIndexOfAny(chars.slice(1))
    } else 
        return -1
}

String.prototype.sideEffect = function (sideEffect: (s: string)=>void): string {
    sideEffect(this as string)
    return this as string
}

String.prototype.parseInt = function (): number|null {
    const result = Number.parseInt(this as string)
    return Number.isNaN(result)
        ? null
        : result
}

Array.prototype.sideEffectForEach = function<T> (sideEffect: (t: T)=>void): T[] {
    this.forEach(sideEffect)
    return this 
}

Array.prototype.insert = function<T> (index: number, t: T): T[] {
    return [...this.slice(0, index),
        t,
        ...this.slice(index)
    ]
}

Array.prototype.change = function<T> (index: number, t: T): T[] {
    return [...this.slice(0, index),
        t,
        ...this.slice(index + 1)
    ]
}

Array.prototype.append = function <T>(t: T): T[] {
    return [...this, t]
}

Array.prototype.contains = function <T>(t: T): boolean {
    return this.find(n => n === t) != undefined
}

Array.prototype.distinct = function () {
    return [...new Set(this)]
}

Array.prototype.filterNone = function <T>(): NonNullable<T>[] {
    return this.filter(n => n) as NonNullable<T>[]
}

Array.prototype.take = function <T>(count: number): T[] {
    return count >= 0 ? this.slice(0, count) : []
}

Array.prototype.skip = function <T>(count: number): T[] {
    return count > 0 ? this.slice(count) : this
}

Array.prototype.diff = function <T>(arr: T[]): T[] {
    const set = new Set(arr)
    return [...new Set(this)].filter(n => !set.has(n))
}

Array.prototype.max = function <T>(mapNumber: (t: T) => number): number {
    return Math.max(...this.map(mapNumber))
}

Array.prototype.min = function <T>(mapNumber: (t: T) => number): number {
    return Math.min(...this.map(mapNumber))
}

Number.prototype.byteCountToString = function () {
    const gb = Math.floor(this.valueOf() / (1024 * 1024 * 1024))
    const mb = this.valueOf() % (1024 * 1024 * 1024)
    if (gb >= 1.0)
        return `${gb},${mb.toString().substring(0, 2)} GB`
    const mb2 = Math.floor(this.valueOf() / (1024 * 1024))
    const kb = this.valueOf() % (1024 * 1024)
    if (mb2 >= 1.0)
        return `${mb2},${kb.toString().substring(0, 2)} MB`
    const kb2 = Math.floor(this.valueOf() / 1024)
    const b = this.valueOf() % 1024
    if (kb2 >= 1.0)
        return `${kb2},${b.toString().substring(0, 2)} KB`
    else
        return `${b} B`
}

Date.prototype.removeMilliseconds = function () {
    const newDate = new Date(this.getTime())
    newDate.setMilliseconds(0)
    return newDate
}

Promise.prototype.map = function<T, U>(func: (value: T) => U): Promise<U> {
    return this.then(v => func(v))
}

Promise.prototype.bind = function<T, U>(func: (value: T) => Promise<U>): Promise<U> {
    return this.then(async v => await func(v))
}

Promise.prototype.pipe = function<T, U>(adapter: (value: Promise<T>)=>U): U {
    return adapter(this)
}

export const delayAsync = (ms: number) => 
    new Promise(res => {
        setTimeout(res, ms)
    })

export const toAsync = <T>(t: T) => new Promise<T>(res => res(t))

export const sideEffect = <T>(t: T, sideEffect: (t: T)=>void) => {
    sideEffect(t)
    return t
}

export { Result }
export { Err }
export { Ok }
export { AsyncResult }
export { AsyncEnumerable }
export { Resetter }
export { RefCell }
export { jsonPost }
export { setBaseUrl }
export { memoize }
export { memoizeAsync }
export { createResolverPromise }
export { createSemaphore }
