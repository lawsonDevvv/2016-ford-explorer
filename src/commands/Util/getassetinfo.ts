import {ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior} from "@sapphire/framework";
import {ApplyOptions} from "@sapphire/decorators";
import {ChatInputCommandInteraction, Message, SlashCommandBuilder} from "discord.js";
import getAssetMetadata from "../../util/roblox/getAssetMetadata";
import {APIGetAssetMetadataResponse} from "../../util/types/Roblox";
import {EmbedBuilder} from "@discordjs/builders";
import {isAxiosError} from "axios";

@ApplyOptions<CommandOptions>({
    description: "Get the metadata for a given asset",
    preconditions: ["Staff"]
})
export default class extends Command {
    public registerApplicationCommands(registry: ApplicationCommandRegistry): void {
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addNumberOption(
                o => o
                    .setName("assetid")
                    .setDescription("Asset ID")
                    .setRequired(true)
            );

        registry.registerChatInputCommand(builder, {
            behaviorWhenNotIdentical: RegisterBehavior.VerboseOverwrite,
            idHints: ["1441800014883061841"]
        });
    }

    public async chatInputRun(interaction: ChatInputCommandInteraction): Promise<Message> {
        await interaction.deferReply();

        const assetId: number = interaction.options.getNumber("assetid", true);

        try {
            const { assetType, description, creationContext, revisionCreateTime, moderationResult, displayName, state }: APIGetAssetMetadataResponse = await getAssetMetadata(assetId);

            const embed = new EmbedBuilder()
                .setTitle("Asset Metadata Search Result")
                .addFields([
                    {
                        name: "Asset Type",
                        value: assetType,
                        inline: true
                    },
                    {
                        name: "Asset Display Name",
                        value: displayName,
                        inline: true
                    },
                    {
                        name: "Moderation Status",
                        value: moderationResult.moderationState,
                        inline: true
                    },
                    {
                        name: "Asset Description",
                        value: description,
                        inline: false
                    },
                    {
                        name: "Asset Creator",
                        value: `${creationContext.creator.groupId ? `groups/${creationContext.creator.groupId}` : `users/${creationContext.creator.userId}`}`,
                        inline: true
                    },
                    {
                        name: "Last Revision",
                        value: revisionCreateTime,
                        inline: true,
                    },
                    {
                        name: "State",
                        value: state,
                        inline: true
                    }
                ])
                .setTimestamp(new Date());

            return await interaction.editReply({
                embeds: [embed]
            })
        } catch (err: any) {
            if (isAxiosError(err)) {
                if (!err.status) this.container.logger.error(err);
                if (err.status === 404) {
                    return await interaction.editReply(`AIR_COMPRESSOR_FAILURE (CIRCUIT_BREAKER_TV_1_TRIPPED) That asset doesn't exist.`);
                }

                return await interaction.editReply(`CBTC_DEADMAN (CBTC_BIE) \`\`\`${err.status} ${err.response?.statusText ?? 'No error message provided'}\`\`\``);
            }
            throw err;
        }
    }
}