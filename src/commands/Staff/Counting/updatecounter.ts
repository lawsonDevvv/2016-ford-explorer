import {ApplyOptions} from "@sapphire/decorators";
import {ApplicationCommandRegistry, Command, CommandOptions} from "@sapphire/framework";
import {ChatInputCommandInteraction, Message, SlashCommandBuilder, TextChannel} from "discord.js";
import {prisma} from "../../../Bot";
import {Counting} from "@prisma/client";
import {EmbedBuilder} from "@discordjs/builders";

@ApplyOptions<CommandOptions>({
    description: 'Update the counting systems current number.',
    preconditions: ["Staff", "GuildTextOnly"]
})
export default class extends Command {
    public registerApplicationCommands(registry: ApplicationCommandRegistry) {
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addNumberOption(o =>
                o
                    .setName('number')
                    .setDescription('The number you want to set it to.')
                    .setMinValue(0)
                    .setMaxValue(99999)
                    .setRequired(true)
            );

        registry.registerChatInputCommand(builder);
    }

    public async chatInputRun(interaction: ChatInputCommandInteraction): Promise<Message | void> {
        const number = interaction.options.getNumber('number', true);
        if (!interaction.guild) return;

        await interaction.deferReply();

        try {
            const countingSettings: Counting | null = await prisma.counting.findUniqueOrThrow({
                where: {
                    server: interaction.guild.id
                }
            });
            if (!countingSettings) return await interaction.editReply({
                content: 'Counting channel does not exist.'
            });

            const countingChannel = await interaction.guild.channels.fetch('1281993412396191847') as TextChannel;

            await prisma.counting.update({
                where: {
                    server: interaction.guild.id
                },
                data: {
                    currentNumber: number
                }
            });

            const embed = new EmbedBuilder()
                .setTitle("Counter Updated")
                .setDescription(`**Next Number:** ${number + 1}`)
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL({ forceStatic: false })
                });

            await countingChannel.send({
                embeds: [embed]
            });

            return interaction.editReply({
                content: ':thumbsup:'
            });
        } catch (err) {
            await interaction.editReply({
                content: `Cylinder 6 Misfire \`\`\`${err instanceof Error ? err.message : err}\`\`\``
            });
        }
    }
}