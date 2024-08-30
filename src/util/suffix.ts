/**
 * Add a suffix to a number.
 * @param number The number to which to add the suffix.
 * @returns Promise<string | Error>
 */
export default async function (number: number): Promise<string | Error>  {
    if (number.toString().endsWith("0")) {
        return `${number}th`;
    } else if (number.toString().endsWith("1")) {
        return `${number}st`;
    } else if (number.toString().endsWith("2")) {
        return `${number}nd`;
    } else if (number.toString().endsWith("3")) {
        return `${number}rd`;
    } else if (number.toString().endsWith("4")) {
        return `${number}th`;
    } else if (number.toString().endsWith("5")) {
        return `${number}th`;
    } else if (number.toString().endsWith("6")) {
        return `${number}th`;
    } else if (number.toString().endsWith("7")) {
        return `${number}th`;
    } else if (number.toString().endsWith("8")) {
        return `${number}th`;
    } else if (number.toString().endsWith("9")) {
        return `${number}th`;
    }
    if (typeof number !== "string") {
        return Promise.reject(new Error("Typeof number must be a string."))
    }
    return Promise.reject(new Error("Something went wrong. Check your code."));
}