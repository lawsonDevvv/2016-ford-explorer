import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from "@sapphire/framework"
import { ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js"
import { getIdFromUsername } from "noblox.js"
import getUserRestrictions from "../../../util/roblox/getUserRestriction"
import {CMTZUniverse, GameJoinRestriction, UniverseIDMetadata} from "../../../util/types/Roblox";
import { EmbedBuilder } from "@discordjs/builders";
import { ApplyOptions } from "@sapphire/decorators";

@ApplyOptions<CommandOptions>({
    description: "Get ban info for a user in a givem CMTZ game.",
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
                    .setDescription("User to look up ban info for.")
                    .setRequired(true)
            )
            .addStringOption(
                o => o
                .setName("game")
                .setDescription("The game to look up ban info for.")
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
                    }
                ])
                .setRequired(true)
            );

            registry.registerChatInputCommand(builder, { behaviorWhenNotIdentical: RegisterBehavior.VerboseOverwrite, idHints: ["1437853390330925188"] })
    }

    public async chatInputRun(interaction: ChatInputCommandInteraction): Promise<Message | void> {
        await interaction.deferReply();

        const username: string = interaction.options.getString("username", true);
        const game: CMTZUniverse = interaction.options.getString("game", true) as CMTZUniverse;

        const userId: number = await getIdFromUsername(username);
        if (!userId) return await interaction.editReply("That username doesn't exist twin.");

        

        try {
            const restriction: GameJoinRestriction = await getUserRestrictions(userId, UniverseIDMetadata[game]);

            const embed = new EmbedBuilder()
                .setTitle(`Ban Info Search Result`);

            if (restriction.active) {
                embed
                   .addFields([
                        {
                          name: "Active",
                          value: ":white_check_mark:",
                          inline: true
                        },
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
                            name: "Private Reason",
                            value: restriction.privateReason,
                            inline: true
                        },
                        {
                            name: "Display Reason",
                            value: restriction.displayReason,
                            inline: true
                        },
                        {
                            name: "Duration",
                            value: restriction.duration ?? "Permanent",
                            inline: false
                        }
                ]);
            } else {
                embed
                    // yes i know this is weird and i dont care but it works cuz im so smort so cry about it
                    .setDescription(`${username} is not banned in ${UniverseIDMetadata[UniverseIDMetadata[game]]}.`);
            }

            return await interaction.editReply({ embeds: [embed] });
        } catch (err) {
            console.log(err)
        }        
    }
}