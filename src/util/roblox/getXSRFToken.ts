import axios from "axios";

export default async (): Promise<string> => {
    const response = await axios.post(
        "https://accountsettings.roblox.com/v1/email",
        {}, // empty body
        {
            headers: {
                "Cookie": `.ROBLOSECURITY=${process.env.ROBLOX_COOKIE}`,
                "Accept": "*/*"
            },
            validateStatus: () => true // i dont really give a fuck what it returns, only that it returns a csrf token which is checked below
        });

    if (!response.headers) throw new Error("No request headers (ParsonsBoweryBroad1)");

    const xsrfToken: string | null = response.headers["x-csrf-token"];
    if (!xsrfToken) throw new Error("No request headers (ParsonsBoweryBroad2)");

    return xsrfToken;
}