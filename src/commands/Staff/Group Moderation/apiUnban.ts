import {ApplyOptions} from "@sapphire/decorators";
import {ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior} from "@sapphire/framework";
import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {CMTZUniverse, UniverseIDMetadata} from "../../../util/types/Roblox";
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

        await apiUnban(userId, UniverseIDMetadata[game]);

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
                }
            ])
            .setFooter({ text: "Re- Relay off A-lead. Relay off A-lead." });

        return await interaction.editReply({ embeds: [embed] });
    }
}