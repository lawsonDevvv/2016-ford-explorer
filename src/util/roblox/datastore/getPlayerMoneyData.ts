import {APIPlayerMoneyDatastoreEntry, } from "../../types/Roblox";
import axios from "axios";
import {apiUrl} from "../../../Bot";

export default async (userId: number): Promise<APIPlayerMoneyDatastoreEntry> => {
    return (
        await axios.get<APIPlayerMoneyDatastoreEntry>(
            `${apiUrl}/datastore/users/${userId}/playerMoneyData`,
            {
                headers: {
                    "Authorization": process.env.API_KEY!
                }
            }
        )
    ).data;
}