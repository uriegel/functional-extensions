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
