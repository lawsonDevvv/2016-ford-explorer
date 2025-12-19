/**
 * @file deleteTicket.ts
 * @description Delete a ticket (and log).
 * 
 * @module util/tickets/deleteTicket
 */

import {Colors, EmbedBuilder, TextChannel, User} from "discord.js";
import {prisma, client} from "../../Bot";
import {TicketStatus, ticketType, TicketTypeMetadata} from "../types/Tickets";


const createDeleteLogEmbed = async (ticketOwner: User, ticketRemover: User, ticketNumber: number, type: ticketType) => {
    return new EmbedBuilder()
        .setTitle('Ticket Deleted')
        .addFields([
            {
                name: 'Ticket Owner',
                value: `${ticketOwner}`,
                inline: true
            },
            {
                name: 'Ticket No.',
                value: `${ticketNumber}`,
                inline: true
            },
            {
                name: 'Ticket Type',
                value: `${TicketTypeMetadata[type]}`,
                inline: true
            },
            {
                name: 'Deleted By',
                value: `${ticketRemover}`,
                inline: true
            }
        ])
        .setTimestamp()
        .setColor(Colors.Red);
}

/**
 * Deletes a ticket and logs the deletion action in the configured logs channel
 * @param channel - The ticket channel to be deleted
 * @param user - The user who initiated the deletion
 * @throws Error if ticket is not found in the database
 * @throws Error if ticket settings are not found for the guild
 * @throws Error if logs channel is not a text channel
 */
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

    const ticketOwner: User = client.users.fetch(ticket.user)

    if (!ticket) throw new Error(`Ticket not found for channel ${channel.id}`);
    if (!ticketSettings) throw new Error(`Ticket settings not found for guild ${channel.guild.id}`);

    const logsChannel = await channel.guild.channels.fetch(ticketSettings.logsChannel);
    if (!(logsChannel instanceof TextChannel)) throw new Error('Logs channel is not of type TextChannel');

    await prisma.ticket.update({
        where: {
            id: ticket.id
        },
        data: {
            status: TicketStatus.Deleted
        }
    });

    await logsChannel.send({
        embeds: [
            await createDeleteLogEmbed(ticketOwner, user, ticket.number, ticket.type as ticketType)
        ]
    });

    await channel.delete(`Ticket deleted by ${user.displayName} (${user.username} | ${user.id})`);
}