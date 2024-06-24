import { Decimal } from "@prisma/client/runtime/library";

/**
 * Check if a string is null, empty or undefined
 * 
 * @param obj the object to check
 * @returns TRUE: if the object is null, empty or undefined, FALSE: otherwise
 */
export function isNullOrEmpty (obj? : any | null | undefined): boolean {
    return obj === null || typeof obj === 'undefined' || !obj;
}

/**
 * Return if the text contains the substring
 * @param str the text to check
 * @param val the value to check for
 * @returns TRUE: if the text contains the substring, FALSE: otherwise
 */
export function stringContains (
    str?: string | null | undefined, 
    val?: string | null | undefined
): boolean {
    if (isNullOrEmpty(str) || isNullOrEmpty(val)) return false;
  
    return str!.indexOf(val!) != -1;
}
  
/**
 * Return if the text contains any of the substrings
 * @param str the text to check
 * @param values the values to check for
 * @returns TRUE: if the text contains any of the values, FALSE: otherwise
 */
export function stringContainsValues (
    str?: string | null | undefined, 
    values?: string[] | null | undefined
) : boolean {
    // for each value in the list, call the stringContains method
    let result = false;
    for (let i = 0; i <= values!.length; i++) {
        const substring = values![i];
        if (stringContains(str, substring)) {
            result = true;
            break;
        }
    }
    return result;
}

/**
 * Check if a list contains a value
 * @param value the value to check for in the list
 * @param list the list to check
 * @returns TRUE: if the list contains the value, FALSE: otherwise
 */
export function listContains<T>(value: T, list: T[]): boolean {
    return list.indexOf(value) !== -1;
}

/**
 * Check if a list contains any of the values
 * @param values the values to check for in the list
 * @param list the list to check
 * @returns TRUE: if the list contains any of the values, FALSE: otherwise
 */
export function listContainsAnItem<T>(values: T[], list: T[]): boolean {
    return values.some((value) => listContains(value, list));
}

/**
 * Parse a text for a shorthand number (e.g. 1,000, 1.1k, 0.5m, 1,00bn, 1b, 1.1k)
 * 
 * Converts all denominations (eg. 'million', 'billion') to just 'k', 'm', or 'b'
 * 
 * @param text the text to parse
 * @returns the first matching shorthand number in a standard format or null if no match was found
 */
export function getShorthandNumberFromText(text: string): string | null {
    // get the first number from typicalChequeSize with possible currency character
    const regex = /(\d+(\.)*(?:,\d{3})*(?:\.\d{2})?)[ ]?(k|million|mn|m|billion|bln|bn|b)?/gi; // i = case insensitive
    const match = text.toLocaleLowerCase().match(regex); // to lowercase in case users enter K, M, B, etc.
    if (match) {
        // - return the first match combined (ie. number and letters)
        // - make it lowercase in case users enter K, M, B, etc.
        // - convert all shorthand characters to just 'k', 'm', or 'b'
        let res = match
            .join('')
            .trim()
            .toLocaleLowerCase() // convert any uppercase characters (eg. K, M, B) to lowercase
            .replace(' ', '') // remove any spaces between the number and the shorthand character
            .replace(/million|mn/g, 'm')
            .replace(/billion|bln|bn/g, 'b');

        // if res is a number with commans, eg. "100,000" then convert it to shorthand, ie. "100k"
        if (stringContains(res, ',')) {
            res = convertToShorthand(res);
        }

        return res;
    }

    return null;
}

/**
 * Convert the number string into the shorthand format (eg. "100,000" to "100k", "100000" to "1m")
 * 
 * @param numStr the number string to convert (eg. "100,000" to "100k")
 * @returns the formatted shorthand number string
 */
export function convertToShorthand(numStr: string): string {
    // remove commas and convert to number
    const num = Number(numStr.replace(/,/g, ''));

    // define shorthand units
    const units = ['k', 'm', 'b'];

    // calculate the index of the unit
    const unitIndex = Math.max(0, Math.floor(Math.log10(Math.abs(num)) / 3));

    // calculate the number in shorthand notation
    const shorthandNum = num / Math.pow(1000, unitIndex);

    // return the number in shorthand notation with the unit
    return `${Number(shorthandNum.toFixed(1))}${units[unitIndex - 1] || ''}`;
}

/**
 * 
 * @param shorthandNumStr the value to get the number from
 * @returns the real numerical value of the string
 */
export function getRealValueForShortandNumber(shorthandNumStr: string): number {
    const shorthandNum = getShorthandNumberFromText(shorthandNumStr);
    if (shorthandNum === undefined || shorthandNum === null) {
        return NaN;
    }

    // Regular expression to match the shorthand format
    const regex = /^([0-9.]+)([kmbt])?$/i;
    const matches = shorthandNum.match(regex);
    if (!matches) {
        // If the input doesn't match the expected format, return NaN
        return NaN;
    }

    const rawValue = matches[1];

    // must use Decimal to avoid floating point errors
    const value = new Decimal(rawValue);
    
    const modifier = matches[2] ? matches[2].toLowerCase() : '';

    switch (modifier) {
        case 'k':
            return value.times(1000).toNumber();
        case 'm':
            return value.times(1000000).toNumber();
        case 'b':
            return value.times(1000000000).toNumber();
        case 't':
            return value.times(1000000000000).toNumber();
        default:
            return value.toNumber();
    }
}

/**
 * Check if text is a number (integer or float)
 * 
 * @param text the text to check
 * @returns TRUE: if the text is a number, FALSE: otherwise
 */
export function isNumeric(text: string): boolean {
    return !isNaN(parseFloat(text)) && isFinite(+text);
}

/**
 * Format a number to a financial string (shorthand), eg. (eg. £2m, $5.5m, etc.)
 * 
 * @param currencySymbol the currency symbol to use
 * @param amount the amount to format
 * @returns the formatted financial string (shorthand) with the currency symbol
 */
export function formatFinancialWithCurrency(
    currencySymbol: string,
    amount: number,
): string {
    return `${currencySymbol}${convertToShorthand(amount.toString())}`;
}

/**
 * Convert all BigInt fields to number
 * @param obj the object to convert
 * @returns the object with all BigInt fields converted to number
 */
export function convertBigIntFieldsToNumber<T>(obj: T): T {
    for (const key in obj) {
      if (obj[key] instanceof BigInt || typeof obj[key] === "bigint") {
        obj[key] = convertBigIntToNumber(obj[key] as bigint) as any;
      }
    }
    return obj;
}

/**
 * Convert a bigInt to a number
 * @param bigInt the bigInt to convert
 * @returns the number
 */
export function convertBigIntToNumber(bigInt: bigint | bigint | number) {
    return Number(bigInt);
}

/**
 * Convert a number to bigInt
 * @param num the number to convert to bigInt
 * @returns the bigInt
 */
export function convertToBigInt(num: number) {
    return BigInt(num);
}

/**
 * @param arr the array to check
 * @returns TRUE: if the array is empty
 */
export const isArrayEmpty = (arr: Array<any> | null | undefined): boolean => {
    return isNullOrEmpty(arr) || arr?.length === 0;
};
