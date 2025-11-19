import axios, {AxiosResponse} from "axios";
import {ApiGenericResponse} from "../types/API";
import {apiUrl, headers} from "../../Bot";
import {Ranks} from "../types/Roblox";

export default async (username: string, rank: Ranks, reason: string): Promise<ApiGenericResponse> => {
    const response: AxiosResponse = await axios.post<ApiGenericResponse>(
        `${apiUrl}/ranking/setRank`,
        {
            username,
            rank,
            reason
        },
        { headers }
    );

    return response.data
}