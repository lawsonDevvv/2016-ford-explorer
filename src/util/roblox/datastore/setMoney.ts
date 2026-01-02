
import {APIPlayerMoneyDatastoreEntry, PlayerMoneyData} from "../../types/Roblox";
import getPlayerMoneyData from "./getPlayerMoneyData";
import setPlayerMoneyData from "./setPlayerMoneyData";

export default async (userId: number, amount: number): Promise<APIPlayerMoneyDatastoreEntry> => {
    const moneyData: PlayerMoneyData = (await getPlayerMoneyData(userId)).value;

    return setPlayerMoneyData(userId, {
        CareerMode: moneyData.CareerMode,
        HighestStreak: moneyData.HighestStreak,
        Money: amount
    });
}