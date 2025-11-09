import { ApplyOptions } from "@sapphire/decorators";
import {ApplicationCommandRegistry, Command, CommandOptions} from "@sapphire/framework";
import {ChatInputCommandInteraction, Message, SlashCommandBuilder} from "discord.js";
import axios from "axios";
import {apiUrl, headers} from "../../Bot";
import {
    ApiGenericResponse,
    ApiGetRankByUsernameSuccessResponse
} from "../../util/types/API";
import {Ranks, RanksMetadata} from "../../util/types/Roblox";

@ApplyOptions<CommandOptions>({
    description: "Get a user's rank",
    preconditions: ["Staff", "GuildTextOnly"]
})
export default class extends Command {
    public registerApplicationCommands(registry: ApplicationCommandRegistry) {
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption(
                o => o
                    .setName('username')
                    .setDescription('CBTC_LOCALIZATION_FAILURE (CBTC_BIE)')
                    .setRequired(true)
            );

        registry.registerChatInputCommand(builder);
    }

    public async chatInputRun(interaction: ChatInputCommandInteraction): Promise<Message | void> {
        await interaction.deferReply();
        const username: string = interaction.options.getString('username', true);

        try {
            const { data } = await axios.get<ApiGetRankByUsernameSuccessResponse>(
                `${apiUrl}/ranking/getRankByUsername?username=${username}`,
                { headers }
            );

            const rankName: string = RanksMetadata[data.rank as Ranks] ?? `Unknown (${data.rank})`;
            return interaction.editReply(`${data.username} is a **${rankName}**.`);
        } catch (err: any) {
            if (axios.isAxiosError<ApiGenericResponse>(err)) {
                return interaction.editReply(`${err.response?.status ?? 'Error'} ${err}`);
            } else {
                this.container.logger.error("Unknown Error: ", err);
                return interaction.editReply(`Unknown Error \`\`\`${err}\`\`\``);
            }
        }
    }
}