/* eslint-disable no-bitwise */
/*
 * Original from base64-js
 * License: MIT
 *
 * https://github.com/beatgammit/base64-js/blob/09b98d0ffa6669aec30c2cbc52e84effae7be66b/index.js
 */

const lookup: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');
const maxChunkLength = 16383; // must be multiple of 3

// https://infra.spec.whatwg.org/#ascii-whitespace
// U+0009 TAB, U+000A LF, U+000C FF, U+000D CR, or U+0020 SPACE.
const ASCII_WHITESPACE = /[\t\n\f\r ]/g;

// https://github.com/joedf/base64.c/blob/f2c2b2bb0d2aa0046784cfb708e3c918e8f24d4b/base64.c#L16
function revLookup(b64: number): number {
    // 65-90  Upper Case     >>  0-25
    // 97-122 Lower Case     >>  26-51
    // 48-57  Numbers        >>  52-61
    // 43     Plus (+)       >>  62
    // 47     Slash (/)      >>  63
    if (b64 === 43) {
        // Plus (+)
        return 62;
    } else if (b64 === 47) {
        // Slash (/)
        return 63;
    } else if (b64 >= 48 && b64 <= 57) {
        // 0 to 9
        return b64 - 48 + 52; // 52 to 61
    } else if (b64 >= 65 && b64 <= 90) {
        // A to Z
        return b64 - 65; // 0 to 25
    } else if (b64 >= 97 && b64 <= 122) {
        // a to z
        return b64 - 97 + 26; // 26 to 51
    } else {
        return throwInvalidBase64Input();
    }
}

function throwInvalidBase64Input(): never {
    throw new Error('Invalid base64 input');
}

// Original: _byteLength
// base64 is 4/3 + up to two characters of the original data
function byteLength(validLen: number, placeHoldersLen: number): number {
    return ((validLen + placeHoldersLen) * 3) / 4 - placeHoldersLen;
}

function toByteArray(base64: string): Uint8Array {
    // https://infra.spec.whatwg.org/#forgiving-base64-decode
    // 1. Remove all ASCII whitespace from data.
    let b64 = base64;
    if (ASCII_WHITESPACE.test(b64)) {
        b64 = b64.replace(ASCII_WHITESPACE, '');
    }
    let validLen = b64.length;
    // 2. If data's length divides by 4 leaving no remainder, then:
    if (validLen % 4 === 0) {
        // If data ends with one or two U+003D (=) code points, then remove them from data.
        if (validLen >= 1 && b64[validLen - 1] === '=') {
            if (validLen >= 2 && b64[validLen - 2] === '=') {
                validLen -= 2;
            } else {
                validLen -= 1;
            }
            b64 = b64.substr(0, validLen);
        }
    }
    // 3. If data's length divides by 4 leaving a remainder of 1, then return failure.
    const remainderLen = validLen % 4;
    if (remainderLen === 1) {
        return throwInvalidBase64Input();
    }
    // 4. If data contains a code point that is not one of
    //     * U+002B (+)
    //     * U+002F (/)
    //     * ASCII alphanumeric
    //    then return failure.
    // Note: Handled by revLookup

    // 5 to 9.
    const placeHoldersLen = remainderLen === 0 ? 0 : 4 - remainderLen;
    const arr = new Uint8Array(byteLength(validLen, placeHoldersLen));

    // if there are placeholders, only get up to the last complete 4 chars
    const len = placeHoldersLen > 0 ? validLen - 4 : validLen;

    let i = 0;
    let curByte = 0;
    let tmp: number;
    for (; i < len; i += 4) {
        tmp =
            (revLookup(b64.charCodeAt(i)) << 18) |
            (revLookup(b64.charCodeAt(i + 1)) << 12) |
            (revLookup(b64.charCodeAt(i + 2)) << 6) |
            revLookup(b64.charCodeAt(i + 3));
        arr[curByte++] = (tmp >> 16) & 0xff;
        arr[curByte++] = (tmp >> 8) & 0xff;
        arr[curByte++] = tmp & 0xff;
    }

    if (placeHoldersLen === 2) {
        tmp = (revLookup(b64.charCodeAt(i)) << 2) | (revLookup(b64.charCodeAt(i + 1)) >> 4);
        arr[curByte++] = tmp & 0xff;
    } else if (placeHoldersLen === 1) {
        tmp = (revLookup(b64.charCodeAt(i)) << 10) | (revLookup(b64.charCodeAt(i + 1)) << 4) | (revLookup(b64.charCodeAt(i + 2)) >> 2);
        arr[curByte++] = (tmp >> 8) & 0xff;
        arr[curByte++] = tmp & 0xff;
    }

    return arr;
}

function tripletToBase64(byte1: number, byte2: number, byte3: number): string {
    return lookup[byte1 >> 2] + lookup[((byte1 & 0x03) << 4) | (byte2 >> 4)] + lookup[((byte2 & 0x0f) << 2) | (byte3 >> 6)] + lookup[byte3 & 0x3f];
}

function encodeChunk(uint8: Uint8Array, start: number, end: number): string {
    const output = [];
    for (let i = start; i < end; i += 3) {
        output.push(tripletToBase64(uint8[i], uint8[i + 1], uint8[i + 2]));
    }
    return output.join('');
}

function fromByteArray(uint8: Uint8Array): string {
    const len = uint8.length;
    const extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
    const parts: string[] = [];

    // go through the array every three bytes, we'll deal with trailing stuff later
    const len2 = len - extraBytes;
    for (let start = 0; start < len2; start += maxChunkLength) {
        parts.push(encodeChunk(uint8, start, Math.min(len2, start + maxChunkLength)));
    }

    // pad the end with zeros, but make sure to not forget the extra bytes
    if (extraBytes === 1) {
        const byte1 = uint8[len - 1];
        parts.push(`${lookup[byte1 >> 2] + lookup[(byte1 & 0x03) << 4]}==`);
    } else if (extraBytes === 2) {
        const byte1 = uint8[len - 2];
        const byte2 = uint8[len - 1];
        parts.push(`${lookup[byte1 >> 2] + lookup[((byte1 & 0x03) << 4) | (byte2 >> 4)] + lookup[(byte2 & 0x0f) << 2]}=`);
    }

    return parts.join('');
}

/**
 * RFC 4648 section 5: Base 64 Encoding with URL and Filename Safe Alphabet
 * https://tools.ietf.org/html/rfc4648#section-5
 *
 * Used by Clear Key (https://www.w3.org/TR/encrypted-media/#clear-key)
 */
export function fromBase64UrlString(base64UrlString: string): Uint8Array {
    const base64String = base64UrlString.replace(/-/g, '+').replace(/_/g, '/');
    return toByteArray(base64String);
}

export function toBase64UrlString(array: Uint8Array): string {
    return fromByteArray(array).replace(/\+/g, '-').replace(/\//g, '_').replace(/[=]/g, '');
}

export { toByteArray as base64StringToUint8Array_, fromByteArray as uint8ArrayToBase64String_ };
