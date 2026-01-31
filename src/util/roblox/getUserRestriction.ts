import axios, { AxiosResponse } from "axios";
import { APIGetRestrictionsResponse, UniverseID } from "../types/Roblox";
import getXSRFToken from "./getXSRFToken";

export default async (userId: number, universeId: UniverseID) => {
    const baseUrl = "https://apis.roblox.com";

    const response: AxiosResponse<APIGetRestrictionsResponse> = await axios.get<APIGetRestrictionsResponse>(
        `${baseUrl}/user/cloud/v2/universes/${universeId}/user-restrictions/${userId}`,
        {
            headers: {
                "Cookie": `.ROBLOSECURITY=${process.env.ROBLOX_COOKIE}`,
                "x-csrf-token": await getXSRFToken()
            }
        }
    );

    return response.data.gameJoinRestriction;
}