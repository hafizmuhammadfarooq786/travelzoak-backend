
export function safeStringEquals(a?: string, b?: string): boolean {
    // normalise the strings
    a = normaliseString(a);
    b = normaliseString(b);

    if (!a || !b) {
        return false;
    }

    if (a.length !== b.length) {
        return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
}
 
/**
 * Normalise a string by ensuring all whitespace is trimmed and all dashes are the same
 * 
 * @param str the string to normalise
 * @returns the normalised string
 */
export function normaliseString (str?: string): string {
    if (!str) return "";
    str = str!.replace(/[\u2013\u2014]/g, '-').trim();
    str = str.replace(/‒/g, '-');
    str = str.replace(/—/g, '-');
    return str!;
}

/**
 * Normalise an object by ensuring all string values are normalised
 * 
 * @param obj the object to normalise
 * @returns the normalised object
 */
export function normaliseObjectStrings(obj: any): any {
    for (const key in obj) {
        if (typeof obj[key] === 'string') {
            obj[key] = normaliseString(obj[key]);
        }
    }
    return obj;
}
