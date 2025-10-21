import {ApplyOptions} from "@sapphire/decorators";
import {ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior} from "@sapphire/framework";
import {
    ChatInputCommandInteraction,
    Message, PermissionFlagsBits, PermissionOverwriteManager, PermissionOverwrites,
    SlashCommandBuilder,
    TextChannel,
    User
} from "discord.js";
import {prisma} from "../../../Bot";
import {Ticket} from "@prisma/client";
import {EmbedBuilder} from "@discordjs/builders";

@ApplyOptions<CommandOptions>({
    description: 'Add a user to a ticket.',
    preconditions: ["Staff", "GuildTextOnly"]
})
export default class extends Command {
    public registerApplicationCommands(registry: ApplicationCommandRegistry) {
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption(o =>
                o
                    .setName('user')
                    .setDescription('The user that will be added to the ticket.')
                    .setRequired(true)
            );

        registry.registerChatInputCommand(builder, { behaviorWhenNotIdentical: RegisterBehavior.Overwrite });
    }

    public async chatInputRun(interaction: ChatInputCommandInteraction): Promise<Message> {
        const user: User = interaction.options.getUser('user', true);

        await interaction.deferReply();

        if (!(interaction.channel instanceof TextChannel)) return await interaction.editReply({
            content: 'This command may only be run in `TextChannel`s.'
        });

        const ticket: Ticket | null = await prisma.ticket.findFirst({
            where: {
                channel: interaction.channelId
            }
        });

        if (!ticket) return await interaction.editReply({
            content: 'This channel is not a ticket.'
        });

        if (user.id === ticket.user) return await interaction.editReply({
            content: 'You cannot add the owner of a ticket to the same ticket, that would be silly!'
        });

        const overwrites: PermissionOverwriteManager = interaction.channel.permissionOverwrites;

        const existingOverwrite: PermissionOverwrites | undefined = overwrites.cache.get(user.id);

        if (existingOverwrite && existingOverwrite.allow.has(PermissionFlagsBits.ViewChannel)) return await interaction.editReply({
            content: 'This user seems to have already been added to the ticket.'
        });

        await overwrites.create(user.id, {
            ViewChannel: true,
            CreatePublicThreads: false,
            CreatePrivateThreads: false
        });

        const embed = new EmbedBuilder()
            .setDescription(`${user} was added to the ticket.`)

        return await interaction.editReply({
            embeds: [embed]
        });
    }
}