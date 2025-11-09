import {ApplyOptions} from "@sapphire/decorators";
import {ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior} from "@sapphire/framework";
import {
    ChatInputCommandInteraction,
    Message,
    SlashCommandBuilder
} from "discord.js";
import axios, {AxiosResponse} from "axios";
import {apiUrl, headers} from "../../Bot";
import {ApiGenericResponse} from "../../util/types/API";
import {GroupRanks, RanksMetadata} from "../../util/types/Roblox";

type SetRankOptions = GroupRanks.Member | GroupRanks.MemberPlus | GroupRanks.Booster;

@ApplyOptions<CommandOptions>({
    description: "Set someone's rank in the group.",
    preconditions: ["Staff"],
    cooldownDelay: 5000
})
export default class extends Command {
    public async registerApplicationCommands(registry: ApplicationCommandRegistry) {
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption(o =>
                o
                    .setName("username")
                    .setDescription("Person to rank.")
                    .setRequired(true)
            )
            .addStringOption(o =>
                o
                    .setName("rank")
                    .setDescription("The rank to set them to.")
                    .setRequired(true)
                    .addChoices([
                        {
                            name: "Server Booster",
                            value: GroupRanks.Booster
                        },
                        {
                            name: "Member+",
                            value: GroupRanks.MemberPlus
                        },
                        {
                            name: "Member",
                            value: GroupRanks.Member
                        }
                        ]
                    )
            )
        ;

        registry.registerChatInputCommand(builder, {behaviorWhenNotIdentical: RegisterBehavior.VerboseOverwrite});
    }

    public async chatInputRun(interaction: ChatInputCommandInteraction): Promise<Message<boolean>> {
        await interaction.deferReply();

        const username: string = interaction.options.getString("username", true);
        const rank: SetRankOptions = interaction.options.getString("rank", true) as SetRankOptions;

        // I don't fully understand how this works, and so I don't expect you to know how it works either
        const rankToGive = RanksMetadata[rank];

        try {
            const response: AxiosResponse = await axios.post<ApiGenericResponse>(
                `${apiUrl}/ranking/setRank`,
                {
                    username,
                    rank: rankToGive,
                    reason: `/setRank ran by ${interaction.user.username}`
                },
                { headers }
            );

            return await interaction.editReply(`${response.data.message ?? ':thumbs_up:'}`);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                if (!err.status) this.container.logger.error(err);
                if (err.status === 418) {
                    return await interaction.editReply(`I_AM_A_TEAPOT (NO_COFFEE) \`\`\`${err.status} You can't set a person's rank to the same rank. That would be silly!\`\`\``);
                }
                return await interaction.editReply(`CBTC_DEADMAN (CBTC_BIE) \`\`\`${err.status} ${err.response?.statusText ?? 'No status text'}\`\`\``);
            }
            throw err;
        }
    }
}