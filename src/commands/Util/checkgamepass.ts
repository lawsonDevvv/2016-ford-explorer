import {ApplyOptions} from "@sapphire/decorators";
import {ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior} from "@sapphire/framework";
import {
    ChatInputCommandInteraction,
    GuildMember,
    InteractionResponse, Message,
    SlashCommandBuilder
} from "discord.js";
import axios, {AxiosResponse, HttpStatusCode} from "axios";
import {apiUrl, headers} from "../../Bot";
import {
    ApiGenericResponse,
    ApiGetRankByUsernameSuccessResponse,
    ApiMemberPlusCheckSuccessResponse
} from "../../util/types/API";

import {Ranks, RanksMetadata} from "../../util/types/Roblox";

@ApplyOptions<CommandOptions>({
    description: "Check if they own the Member+ pass.",
    cooldownDelay: 15000,
    preconditions: ['Staff']
})
export default class extends Command {
    public registerApplicationCommands(registry: ApplicationCommandRegistry): void {
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption(o =>
                o
                    .setName("username")
                    .setDescription("Mention the person you want to inventory check.")
                    .setRequired(true)
            )
            .addUserOption(o =>
                o
                    .setName("discord_user")
                    .setDescription("Mention the person you want to inventory check.")
                    .setRequired(false)
            )
        ;

        registry.registerChatInputCommand(builder, {behaviorWhenNotIdentical: RegisterBehavior.VerboseOverwrite});
    }

    public async chatInputRun(interaction: ChatInputCommandInteraction): Promise<void | InteractionResponse | Message> {
        await interaction.deferReply();
        const username: string = interaction.options.getString("username", true);
        const user: GuildMember | null = interaction.options.getMember("discord_user") as GuildMember | null;

        try {
            const getRankResponse: AxiosResponse<ApiGetRankByUsernameSuccessResponse> = await axios.get<ApiGetRankByUsernameSuccessResponse>(
                `${apiUrl}/ranking/getRankByUsername?username=${username}`,
                { headers }
            );

            if (getRankResponse.data.rank >= Ranks.MemberPlus) return interaction.editReply(`User is already at or above the rank of Member+, ranking them would be a demotion. TRAIN_OPERATOR_ZONE_OVERRIDE (BIE)`);

            const memberPlusResponse: AxiosResponse<ApiMemberPlusCheckSuccessResponse> = await axios.get<ApiMemberPlusCheckSuccessResponse>(
                `${apiUrl}/ranking/memberPlusCheck?username=${username}`,
                { headers }
            );

            if (!memberPlusResponse.data.ownsGamePass) return interaction.editReply(`No GamePass found in the user's inventory. CBTC_NO_EPIC_PASS (CBTC_AUTH_ERROR)`);

            await axios.post<ApiGenericResponse>(
                `${apiUrl}/ranking/setRank`,
                {
                    username,
                    rank: Ranks.MemberPlus
                },
                { headers }
            );

            if (user) await user.roles.add(['1200892438470991914', '1219419344589819905']);

            return interaction.editReply(`Set ${username}'s rank to ${RanksMetadata[Ranks.MemberPlus]}.`);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                if (!err.status) return this.container.logger.error(err);
                if (err.status === HttpStatusCode.ImATeapot) {
                    return await interaction.editReply(`I_AM_A_TEAPOT (NO_COFFEE) \`\`\`${err.status} You can't set a person's rank to the same rank. That would be silly!\`\`\``);
                }
                return await interaction.editReply(`CBTC_DEADMAN (CBTC_BIE) \`\`\`${err.response?.status ?? 0o00} ${err.response?.data.message ?? 'No status text'}\`\`\``);
            } else throw err;
        }
    }
}