export default function parseDateTime(dateTimeString: string): Date | null {
    const formats = [
        /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/, // MM-DD-YYYY HH:MM
        /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/, // MM/DD/YYYY HH:MM
        /^[A-Za-z]+ \d{1,2}, \d{4} \d{2}:\d{2}$/, // Month Day, Year HH:MM
    ];

    const cleanInput = dateTimeString.trim();

    // Try to match known formats
    for (const format of formats) {
        if (format.test(cleanInput)) {
            // Normalize input if necessary (e.g., MM/DD/YYYY -> MM-DD-YYYY for consistency)
            const normalizedInput = cleanInput.replace(/\//g, '-');
            return new Date(normalizedInput);
        }
    }

    // Attempt to parse with Date.parse() as a fallback
    const parsedDate = new Date(cleanInput);
    if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
    }

    // If none of the above work, return null
    return null;
}
