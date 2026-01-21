import {EmbedBuilder, User} from "discord.js";
import {PlayerMoneyData} from "../../types/Roblox";

export default (username: string, staffMember: User, playerMoneyData: PlayerMoneyData, etag: string, title: string): EmbedBuilder => {
    return new EmbedBuilder()
        .setTitle(title)
        .addFields([
            {
                name: "Target",
                value: username,
                inline: true
            },
            {
                name: "Staff Member",
                value: `${staffMember}`,
                inline: true
            },
            {
                name: "Career Mode",
                value: playerMoneyData.CareerMode,
                inline: false
            },
            {
                name: "Highest Streak",
                value: `${playerMoneyData.HighestStreak}`,
                inline: true
            },
            {
                name: "Money",
                value: `${playerMoneyData.Money}`,
                inline: true
            }
        ])
        .setFooter({ text: `etag ${etag}` });
}