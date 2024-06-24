
/**
 * Helper function to convert a string to a JSON object (converting BigInts to strings)
 * 
 * @param obj the object to convert to string
 * @returns the string representation of the object
 */
export const jsonToString = (obj: any): any => {
    return JSON.stringify(
      obj,
      (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
    );
};