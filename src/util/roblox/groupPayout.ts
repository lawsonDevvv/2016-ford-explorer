import axios from "axios"
import getXSRFToken from "./getXSRFToken";
import {client} from "../../Bot";

export default async (groupId: number, userId: number, amount: number): Promise<void> => {
    client.logger.info("A");
    const xsrfToken = await getXSRFToken();
    client.logger.info("AAAAAAAAAAAAA");
    return axios.post(`https://groups.roblox.com/v1/groups/${groupId}/payouts`,
        {
            "recipientId": userId,
            "recipientType": 0,  // User recipient type
            "amount": amount
        },
        {
            headers: {
                'Cookie': `.ROBLOSECURITY=${process.env.ROBLOX_COOKIE}`,
                'Content-Type': 'application/json',
                'x-csrf-token': xsrfToken
            }
        }
    );
}