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

