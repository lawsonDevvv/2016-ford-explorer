/**
 * Add a suffix to a number.
 * @param number The number to which to add the suffix.
 * @returns Promise<string | Error>
 */
export default async function (number: number): Promise<string>  {
    const numberString: string = number.toString();

    switch (numberString.slice(numberString.length - 1, numberString.length)) {
        case "0":
            return "th";
        case "1":
            return "st";
        case "2":
            return "nd";
        case "3":
            return "rd";
        default:
            return "st";
    }
}