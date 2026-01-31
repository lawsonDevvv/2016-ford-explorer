import axios from "axios";
import {client} from "../../Bot";
import {UniverseID, UniverseIDMetadata} from "../types/Roblox";

export default async (universeId: UniverseID): Promise<void> => {
    const baseUrl = "https://apis.roblox.com"

     await axios.post<{}>(
        `${baseUrl}/cloud/v2/universes/${universeId}:restartServers`,
        {}, // empty body
        {
            headers: {
                "x-api-key": process.env.ROBLOX_OPENCLOUD_API_KEY
            }
        }
    );

    client.logger.info(`Restarted ${UniverseIDMetadata[universeId]}`);
}