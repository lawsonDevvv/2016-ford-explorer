import {ApplicationCommandRegistry, Command, CommandOptions} from "@sapphire/framework";
import {ApplyOptions} from "@sapphire/decorators";
import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {getIdFromUsername} from "noblox.js";
import removeStreak from "../../../util/roblox/datastore/removeStreak";
import {APIPlayerMoneyDatastoreEntry} from "../../../util/types/Roblox";
import generateDatastoreEditResultEmbed from "../../../util/roblox/datastore/generateDatastoreEditResultEmbed";

@ApplyOptions<CommandOptions>({
    description: "Remove streaks from a player. (Will not work if they are in-game)",
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
                    .setName("increment")
                    .setDescription("The amount of streaks to take the user")
                    .setMinValue(1)
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

        const removeStreakResponse: APIPlayerMoneyDatastoreEntry = await removeStreak(userId, increment);

        return await interaction.editReply({
            embeds: [
                generateDatastoreEditResultEmbed(username, interaction.user, removeStreakResponse.value, removeStreakResponse.etag, "Remove Streak Result")
            ]
        });
    }
}