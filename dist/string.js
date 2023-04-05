"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line
String.prototype.substringAfter = function (startChar) {
    var _a;
    var posStart = (_a = (this === null || this === void 0 ? void 0 : this.indexOf(startChar)) + 1) !== null && _a !== void 0 ? _a : -1;
    return posStart != -1 && posStart < this.length - 1
        ? this.substring(posStart)
        : "";
};
// eslint-disable-next-line
String.prototype.substringUntil = function (endChar) {
    var _a, _b;
    var posEnd = (_a = this === null || this === void 0 ? void 0 : this.indexOf(endChar)) !== null && _a !== void 0 ? _a : 0;
    return posEnd > 0
        ? this.substring(0, posEnd)
        : (_b = this) !== null && _b !== void 0 ? _b : "";
};
// eslint-disable-next-line
String.prototype.stringBetween = function (startChar, endChar) {
    var _a, _b;
    return (_b = (_a = this === null || this === void 0 ? void 0 : this.substringAfter(startChar)) === null || _a === void 0 ? void 0 : _a.substringUntil(endChar)) !== null && _b !== void 0 ? _b : "";
};
// eslint-disable-next-line
String.prototype.lastIndexOfAny = function (chars) {
    if (chars.length > 0) {
        var res = this.lastIndexOf(chars[0]);
        return res != -1
            ? res + 1
            : this.lastIndexOfAny(chars.slice(1));
    }
    else
        return -1;
};
