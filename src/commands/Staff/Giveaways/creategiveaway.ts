import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, Command, CommandOptions } from "@sapphire/framework";
import {
    ActionRowBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    Colors,
    InteractionResponse,
    Message,
    MessageActionRowComponentBuilder,
    SlashCommandBuilder,
    TextChannel
} from "discord.js";
import GiveawayManager from "../../../util/giveaway/GiveawayManager";
import { ButtonBuilder, EmbedBuilder } from "@discordjs/builders";
import { prisma } from "../../../Bot";

@ApplyOptions<CommandOptions>({
    description: "Create a giveaway.",
    preconditions: ["Staff"]
})
export default class CreateGiveaway extends Command {
    public registerApplicationCommands(registry: ApplicationCommandRegistry) {
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addChannelOption(o =>
                o
                    .setName("channel")
                    .setDescription("The channel to post the giveaway in.")
                    .setRequired(true)
            )
            .addStringOption(o =>
                o
                    .setName("prize")
                    .setDescription("The prize for winning this giveaway.")
                    .setRequired(true)
            )
            .addNumberOption(o =>
                o
                    .setName("winners")
                    .setDescription("The amount of winners this giveaway can have.")
                    .setRequired(true)
            )
            .addStringOption(o =>
                o
                    .setName("end_date")
                    .setDescription("When this giveaway should end.")
                    .setRequired(true)
            );

        registry.registerChatInputCommand(builder);
    }

    public async chatInputRun(interaction: ChatInputCommandInteraction) {
        const channel = interaction.options.getChannel("channel", true);
        if (!(channel instanceof TextChannel)) return await interaction.reply(`<#${channel.id}> is not a TextChannel.`);
        const prize = interaction.options.getString("prize", true);
        const winners = interaction.options.getNumber("winners", true);
        const endDate = interaction.options.getString("end_date", true);

        const parsedEndDate: number = Date.parse(endDate);

        if (!interaction.guild) return await interaction.reply("This command can only be used in a server.");
        if (isNaN(parsedEndDate)) return await interaction.reply(`${endDate} is not a valid date.`);

        const giveaway = await GiveawayManager.createGiveaway(
            interaction.guild.id,
            channel.id,
            prize,
            winners,
            new Date(parsedEndDate),
            interaction.user
        ).catch(async (reason: any) => {
            this.container.logger.error(reason);
            return await interaction.reply("Error creating giveaway.");
        });

        const embed = new EmbedBuilder()
            .setTitle("Giveaway")
            .setColor(Colors.Blue)
            .addFields([
                { name: "Prize", value: prize, inline: false },
                { name: "Winners", value: winners.toString(), inline: true },
                { name: "Ends At", value: `<t:${Math.floor(parsedEndDate / 1000)}:F>`, inline: true }
            ])
            .setTimestamp(new Date());

        const joinButton = new ButtonBuilder()
            .setLabel("Join Giveaway")
            .setEmoji({ name: "🎊" })
            .setStyle(ButtonStyle.Primary)
            .setCustomId("joinGiveawayButton");

        const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([joinButton]);

        const message: Message<true> | InteractionResponse<boolean> = await channel
            .send({ embeds: [embed], components: [actionRow] })
            .catch(async () => {
                return await interaction.reply("Failed to send the giveaway message.");
            });

        await prisma.giveaway
            .update({
                where: { id: giveaway.id as number },
                data: { messageId: message.id }
            })
            .catch(async () => {
                return await interaction.reply(
                    "The giveaway was created, but there was an error updating the database."
                );
            });

        return await interaction.reply(
            `Created giveaway in ${channel} with a prize of \`${prize}\` ending at ${endDate}.\n\n**Giveaway ID: ${giveaway.id}**`
        );
    }
}
