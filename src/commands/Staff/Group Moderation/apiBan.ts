import {ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior} from "@sapphire/framework";
import {ChatInputCommandInteraction, SlashCommandBuilder, TextChannel} from "discord.js";
import {ApplyOptions} from "@sapphire/decorators";
import {getIdFromUsername} from "noblox.js";
import {GameJoinRestriction, CMTZUniverse, UniverseIDMetadata} from "../../../util/types/Roblox";
import apiBan from "../../../util/roblox/apiBan";
import {EmbedBuilder} from "@discordjs/builders";

@ApplyOptions<CommandOptions>({
    description: "Ban a user via the Roblox API from either Fulton Street or The Rockaways. Supports IP bans.",
    preconditions: ["Staff"]
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
                    .setMaxLength(36)
                    .setRequired(true)
            )
            .addStringOption(
                o => o
                    .setName("publicreason")
                    .setDescription("The ban reason that will be displayed in logs.")
                    .setMinLength(5)
                    .setMaxLength(64)
                    .setRequired(true)
            )
            .addStringOption(
                o => o
                 .setName("privatereason")
                 .setDescription("This ban reason is only visible to you.")
                 .setMinLength(5)
                 .setMaxLength(64)
                 .setRequired(true)
            )
            .addBooleanOption(
                o => o
                    .setName("ipban")
                    .setDescription("Whether to include all known alt accounts.")
                    .setRequired(true)
            )

            .addStringOption(
                o => o
                    .setName("game")
                    .setDescription("The game to ban the target on.")
                    .addChoices([
                        {
                            name: "Fulton Street",
                            value: "fultonSt"
                        },
                        {
                            name: "The Rockaways",
                            value: "theRockaways"
                        }
                    ])
                    .setRequired(true)
            )
            .addStringOption(
                o => o
                    .setName("duration")
                    .setDescription("Ban duration (ex: 10s; 5m; 1y; etc")
                    .setMinLength(2)
                    .setRequired(false)
            );

        registry.registerChatInputCommand(builder, {
            behaviorWhenNotIdentical: RegisterBehavior.VerboseOverwrite
        });
    }

    public async chatInputRun(interaction: ChatInputCommandInteraction): Promise<any> {
        await interaction.deferReply();

        if (!interaction.guild || !(interaction.channel instanceof TextChannel)) return;

        const username: string = interaction.options.getString("username", true);
        const displayReason: string = interaction.options.getString("publicreason", true);
        const privateReason: string = interaction.options.getString("privatereason", true);
        const ipBan: boolean = interaction.options.getBoolean("ipban", true);
        const duration: string | null = interaction.options.getString("duration", false);
        const game: CMTZUniverse = interaction.options.getString("game", true) as CMTZUniverse;

        const userId: number = await getIdFromUsername(username);
        if (!userId) return await interaction.editReply("That username doesn't exist twin.");

        // Supports single time units, ex: 10m, 2s, 5y, etc.
        const durationRegex: RegExp = /^\d+(?:\.\d+)?\s*([smhdwy])$/i;

        if (duration && !durationRegex.test(duration)) return await interaction.editReply({ content: "Invalid duration. Only input single time units like 10m, 2s, 5y, etc." });

        const gameJoinRestriction: GameJoinRestriction = (await apiBan(userId, UniverseIDMetadata[game], displayReason, privateReason, !ipBan, duration)).gameJoinRestriction;

        const embed = new EmbedBuilder()
            .setTitle("API Ban Result")
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
                    name: "Reason",
                    value: gameJoinRestriction.displayReason,
                    inline: false
                },
                {
                    name: "Staff Member",
                    value: interaction.user.toString(),
                    inline: true
                },
                {
                    name: "Duration",
                    value: gameJoinRestriction.duration ? gameJoinRestriction.duration.toString() : "Permanent",
                    inline: true
                }
            ])
            .setFooter({ text: "Get beamed by 6ixGang." })
            .setTimestamp();

        return await interaction.editReply({ embeds: [embed] });
    }
}