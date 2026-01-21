import {APIPlayerMoneyDatastoreEntry, PlayerMoneyData} from "../../types/Roblox";
import axios from "axios";
import {apiUrl} from "../../../Bot";

export default async (userId: number, data: PlayerMoneyData): Promise<APIPlayerMoneyDatastoreEntry> => {
    return (
        await axios.patch<APIPlayerMoneyDatastoreEntry>(
            `${apiUrl}/datastore/users/${userId}/playerMoneyData?allowMissing=false`,
            data,
            {
                headers: {
                    "Authorization": process.env.API_KEY!
                }
            }
    )).data;
}