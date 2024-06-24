
/**
 * @param code the HTTP code to check
 * @returns TRUE if the code is a success code, FALSE otherwise
 */
export function isHttpSuccessCode(code: number): boolean {
    return code >= 200 && code < 300;
}