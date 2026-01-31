import {ApplicationCommandRegistry, Command, CommandOptions} from "@sapphire/framework";
import {ApplyOptions} from "@sapphire/decorators";
import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {getIdFromUsername} from "noblox.js";
import setStreak from "../../../util/roblox/datastore/setStreak";
import {APIPlayerMoneyDatastoreEntry} from "../../../util/types/Roblox";
import generateDatastoreEditResultEmbed from "../../../util/roblox/datastore/generateDatastoreEditResultEmbed";

@ApplyOptions<CommandOptions>({
    description: "Set a player's streaks. (Overrides all streaks they previously had, use /addstreak to add)",
    preconditions: ["Developer"]
})
export default class extends Command {
    public registerApplicationCommands(registry: ApplicationCommandRegistry): void {
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption(
                o => o
                    .setName("username")
                    .setDescription("Target user")
                    .setMinLength(3)
                    .setRequired(true)
            )
            .addNumberOption(
                o => o
                    .setName("amount")
                    .setDescription("The amount of streaks to set")
                    .setMinValue(0)
                    .setRequired(true)
            );

        registry.registerChatInputCommand(builder);
    }

    public async chatInputRun(interaction: ChatInputCommandInteraction): Promise<any> {
        await interaction.deferReply();

        const username: string = interaction.options.getString("username", true);
        const increment: number = interaction.options.getNumber("increment", true);

        const userId: number | undefined = await getIdFromUsername(username);
        if (!userId) return await interaction.reply("That user doesn't exist twin.");

        const setStreakResponse: APIPlayerMoneyDatastoreEntry = await setStreak(userId, increment);

        return await interaction.editReply({
            embeds: [
                generateDatastoreEditResultEmbed(username, interaction.user, setStreakResponse.value, setStreakResponse.etag, "Set Streak Result")
            ]
        });
    }
}