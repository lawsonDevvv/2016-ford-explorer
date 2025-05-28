import {Colors, EmbedBuilder, TextChannel, User} from "discord.js";
import {prisma} from "../../Bot";

const createDeleteLogEmbed = async (user: User, ticketNumber: number) => {
    return new EmbedBuilder()
        .setTitle('Ticket Deleted')
        .addFields([
            {
                name: 'Ticket No.',
                value: `${ticketNumber}`,
                inline: true
            },
            {
                name: 'Deleted By',
                value: `${user}`,
                inline: true
            }
        ])
        .setTimestamp()
        .setColor(Colors.Red);
}

export default async (channel: TextChannel, user: User) => {
    const ticket = await prisma.ticket.findFirst({
        where: {
            channel: channel.id
        }
    });

    const ticketSettings = await prisma.ticketSettings.findFirst({
        where: {
            guild: channel.guild.id
        }
    });

    if (!ticket) throw new Error(`Ticket not found for channel ${channel.id}`);
    if (!ticketSettings) throw new Error(`Ticket settings not found for guild ${channel.guild.id}`);

    const logsChannel = await channel.guild.channels.fetch(ticketSettings.logsChannel);
    if (!(logsChannel instanceof TextChannel)) throw new Error('Logs channel is not of type TextChannel');

    await logsChannel.send({
        embeds: [
            await createDeleteLogEmbed(user, ticket.number)
        ]
    })
}