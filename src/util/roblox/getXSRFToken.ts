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
            validateStatus: () => true
        });

    if (!response.headers) throw new Error("No request headers (ParsonsBoweryBroad1)");

    const xsrfToken: string | null = response.headers["x-csrf-token"];
    if (!xsrfToken) throw new Error("No request headers (ParsonsBoweryBroad2)");

    return xsrfToken;
}