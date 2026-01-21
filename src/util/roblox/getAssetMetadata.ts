import axios, { AxiosResponse } from "axios";
import {APIGetAssetMetadataResponse} from "../types/Roblox";
import getXSRFToken from "./getXSRFToken";

export default async (assetId: number) => {
    const baseUrl = "https://apis.roblox.com/assets";

    const response: AxiosResponse<APIGetAssetMetadataResponse> = await axios.get<APIGetAssetMetadataResponse>(
        `${baseUrl}/v1/assets/${assetId}`,
        {
            headers: {

                "x-csrf-token": await getXSRFToken(),
                "x-api-key": process.env.ROBLOX_OPENCLOUD_API_KEY
            }
        }
    );

    return response.data;
}