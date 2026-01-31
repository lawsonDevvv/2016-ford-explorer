import {ApplyOptions} from "@sapphire/decorators";
import {ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior} from "@sapphire/framework";
import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {CMTZUniverse, UniverseID, UniverseIDMetadata} from "../../../util/types/Roblox";
import {getIdFromUsername} from "noblox.js";
import apiUnban from "../../../util/roblox/apiUnban";
import {EmbedBuilder} from "@discordjs/builders";

@ApplyOptions<CommandOptions>({
    description: "Unban a user from a CMTZ game.",
    preconditions: ["Staff"]
})
export default class extends Command {
    public registerApplicationCommands(registry: ApplicationCommandRegistry) {
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption(
                o => o
                    .setName("username")
                    .setDescription("Target user")
                    .setMinLength(3)
                    .setMaxLength(32)
                    .setRequired(true)
            )
            .addStringOption(
                o => o
                    .setName("game")
                    .setDescription("The game to ban the target on")
                    .setChoices([
                        {
                            name: "The Rockaways",
                            value: "theRockaways"
                        },
                        {
                            name: "Fulton Street",
                            value: "fultonSt"
                        },
                        {
                            name: "Eli's Subway",
                            value: "elisSubway"
                        },
                        {
                            name: "All CMTZ Games",
                            value: "all"
                        }
                    ])
                    .setRequired(true)
            );

        registry.registerChatInputCommand(builder, { behaviorWhenNotIdentical: RegisterBehavior.VerboseOverwrite, idHints: ["1436955261549023293"] });
    }

    public async chatInputRun(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();

        const username: string = interaction.options.getString("username", true);
        const game: CMTZUniverse = interaction.options.getString("game", true) as CMTZUniverse;

        const userId: number = await getIdFromUsername(username);
        if (!userId) return await interaction.editReply("That username doesn't exist twin.");

        let games: UniverseID[] = [];
        let successfulGameUnbans: UniverseID[] = [];

        switch (game as CMTZUniverse | "all") {
            case "fultonSt":
                games.push(UniverseID.FultonStreet);
                break;
            case "theRockaways":
                games.push(UniverseID.FultonStreet);
                break;
            case "elisSubway":
                games.push(UniverseID.ElisSubway);
                break;
            default:
                games.push(UniverseID.FultonStreet, UniverseID.TheRockaways, UniverseID.ElisSubway);
                break;
        }

        for (const game of games) {
            await apiUnban(userId, game);
            successfulGameUnbans.push(game)
        }

        const mappedGames: string = successfulGameUnbans.map((successfulGameBan: UniverseID): string => UniverseIDMetadata[successfulGameBan]).join(", ");

        const embed = new EmbedBuilder()
            .setTitle("API Unban Result")
            .addFields([
                {
                    name: "Target",
                    value: username,
                    inline: true
                },
                {
                    name: "Target ID",
                    value: userId.toString(),
                    inline: true
                },
                {
                    name: "Staff Member",
                    value: interaction.user.toString(),
                    inline: false
                },
                {
                    name: "Game(s)",
                    value: mappedGames,
                    inline: true
                }
            ])
            .setFooter({ text: "Re- Relay off A-lead. Relay off A-lead." })
            .setTimestamp(new Date());

        return await interaction.editReply({ embeds: [embed] });
    }
}