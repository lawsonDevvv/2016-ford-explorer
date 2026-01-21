import getPlayerMoneyData from "./getPlayerMoneyData";
import {APIPlayerMoneyDatastoreEntry, PlayerMoneyData} from "../../types/Roblox";
import setPlayerMoneyData from "./setPlayerMoneyData";

export default async (userId: number, streak: number): Promise<APIPlayerMoneyDatastoreEntry> => {
    const moneyData: PlayerMoneyData = (await getPlayerMoneyData(userId)).value;

    return setPlayerMoneyData(userId, {
        CareerMode: moneyData.CareerMode,
        HighestStreak: streak,
        Money: moneyData.Money
    })
}