import {ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior} from "@sapphire/framework";
import {ChatInputCommandInteraction, Message, SlashCommandBuilder} from "discord.js";
import {ApplyOptions} from "@sapphire/decorators";
import restartServers from "../../util/roblox/restartServers";
import {CMTZUniverse, UniverseIDMetadata} from "../../util/types/Roblox";
import axios from "axios";

@ApplyOptions<CommandOptions>({
    description: "Migrate all old servers to the latest update.",
    preconditions: ["Developer"]
})
export default class extends Command {
    public registerApplicationCommands(registry: ApplicationCommandRegistry): void {
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption(
                o => o
                    .setName("game")
                    .setDescription("The game to perform the migration on.")
                    .addChoices([
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
            );

        registry.registerChatInputCommand(builder, { behaviorWhenNotIdentical: RegisterBehavior.VerboseOverwrite, idHints: ["1441799845693100204"] })
    }

    public async chatInputRun(interaction: ChatInputCommandInteraction): Promise<Message> {
        await interaction.deferReply();

        const game: CMTZUniverse = interaction.options.getString("game", true) as CMTZUniverse;

        await interaction.editReply("Attempting restart.")
        try {
            await restartServers(UniverseIDMetadata[game]);
            return await interaction.editReply(`Migrated all players in ${UniverseIDMetadata[UniverseIDMetadata[game]]}`);
        } catch (err: any) {
            if (axios.isAxiosError(err)) {
                console.log(err.response)
                return await interaction.editReply(`CBTC_TRANSPONDER_FAILURE (CBTC_BIE) \`\`\`${err.response ? `${err.response.status} ${err.response.statusText}` : err}\`\`\``)
            } else {
                return await interaction.editReply(`CBTC_COMMAND_BIE (CBTC_BIE) \`\`\`${err.message ?? err}\`\`\``);
            }
        }

    }
}