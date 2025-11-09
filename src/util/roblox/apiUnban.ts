import axios, {AxiosResponse} from "axios";
import {APIUnbanResponse} from "../types/Roblox";
import getXSRFToken from "./getXSRFToken";

export default async (userId: number, universeId: number) => {
    const baseUrl = "https://apis.roblox.com";

    const response: AxiosResponse<APIUnbanResponse> = await axios.patch<APIUnbanResponse>(
        `${baseUrl}/user/cloud/v2/universes/${universeId}/user-restrictions/${userId}`,
        {
            gameJoinRestriction: {
                active: false
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

    return response.data
}