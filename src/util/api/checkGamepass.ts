import axios, {AxiosResponse} from "axios";
import {ApiMemberPlusCheckSuccessResponse} from "../types/API";
import {apiUrl, headers} from "../../Bot";

export default async (username: string): Promise<ApiMemberPlusCheckSuccessResponse> => {
    const memberPlusResponse: AxiosResponse<ApiMemberPlusCheckSuccessResponse> = await axios.get<ApiMemberPlusCheckSuccessResponse>(
        `${apiUrl}/ranking/memberPlusCheck?username=${username}`,
        { headers }
    );

    return memberPlusResponse.data;
}