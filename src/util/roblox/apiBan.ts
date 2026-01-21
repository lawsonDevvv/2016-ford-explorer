import axios, { AxiosResponse } from "axios";
import {APIBanResponse} from "../types/Roblox";
import getXSRFToken from "./getXSRFToken";

export default async (userId: number, universeId: number, displayReason: string, privateReason: string, excludeAltAccounts: boolean, duration?: string | null): Promise<APIBanResponse> => {
    const baseUrl = "https://apis.roblox.com";

    const response: AxiosResponse<APIBanResponse> = await axios.patch<APIBanResponse>(
        `${baseUrl}/user/cloud/v2/universes/${universeId}/user-restrictions/${userId}`,
        {
            gameJoinRestriction: {
                active: true,
                privateReason,
                displayReason,
                excludeAltAccounts,
                ...(duration ? { duration } : {})
            }
        },
        {
            headers: {
                Cookie: `.ROBLOSECURITY=${process.env.ROBLOX_COOKIE}`,
                Accept: "*/*",
                "x-csrf-token": await getXSRFToken()
            }
        }
    );

    return response.data;
}