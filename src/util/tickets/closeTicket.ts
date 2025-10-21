import {Guild, GuildMember, OverwriteType, PermissionsBitField, TextChannel} from "discord.js";
import {prisma} from "../../Bot";
import {Ticket} from "@prisma/client";
import {ButtonBuilder, EmbedBuilder, ActionRowBuilder} from "@discordjs/builders";
import {TicketRoles, TicketStatus, TicketTypes} from "../types/Tickets";
import {ButtonStyle} from "discord-api-types/v10";

const createCloseEmbed = (member: GuildMember, closedBy: GuildMember, reason: string): EmbedBuilder => {
    return new EmbedBuilder()
        .setColor(0xFF0000) // Red color for closed tickets
        .setTitle('Ticket Closed')
        .addFields([
            {
                name: 'Ticket Owner',
                value: `${member}`,
                inline: true
            },
            {
                name: 'Closed By',
                value: `${closedBy}`,
                inline: true
            },
            {
                name: 'Closed At',
                value: new Date().toLocaleString(),
                inline: true
            },
            {
                name: 'Reason',
                value: reason,
                inline: false
            }
        ])
        .setDescription('This ticket has been closed. The channel will be deleted shortly.');
};

/**
 * Closes an existing ticket channel and updates the database entry
 * @param guild - The Discord guild where the ticket exists
 * @param channel - The ticket channel to close
 * @param closedBy - The user who is closing the ticket
 * @param reason - Optional reason for closing the ticket
 * @returns The updated ticket database entry
 * @throws Error if ticket is not found in the database
 */
export default async (guild: Guild, channel: TextChannel, closedBy: GuildMember, reason?: string): Promise<Ticket> => {
    const ticket: Ticket | null = await prisma.ticket.findFirst({ 
        where: { 
            guild: guild.id, 
            channel: channel.id
        } 
    });

    if (!ticket) throw new Error(`Ticket not found for channel ${channel.name}`);

    if (ticket.status === TicketStatus.Closed) throw new Error(`Ticket ${ticket.number} is already closed.`);

    const ticketOwner = await guild.members.fetch(ticket.user).catch(() => null);

    const openButton = new ButtonBuilder()
        .setCustomId('reopenTicketButton')
        .setLabel('Open')
        .setStyle(ButtonStyle.Success);

    const deleteButton = new ButtonBuilder()
        .setCustomId('deleteTicketButton')
        .setLabel('Delete')
        .setStyle(ButtonStyle.Danger);

    const ticketClosedActionRow = new ActionRowBuilder<ButtonBuilder>()
        .setComponents([openButton, deleteButton]);

    await channel.send({
        embeds: [
            createCloseEmbed(
                ticketOwner || closedBy,
                closedBy,
                reason || 'No reason provided'
            )
        ],
        components: [ticketClosedActionRow]
    });

    const updatedTicket = await prisma.ticket.update({
        where: { id: ticket.id },
        data: { 
            status: TicketStatus.Closed,
            closedBy: closedBy.id,
            closedAt: new Date(),
            closedReason: reason
        }
    });

    await channel.edit({
        name: `closed-${ticket.number}`,
        permissionOverwrites: [
            // @everyone
            {
                type: OverwriteType.Role,
                id: guild.id,
                deny: [
                    PermissionsBitField.Flags.ViewChannel
                ]
            },
            // Ticket User
            {
                type: OverwriteType.Member,
                id: ticket.user,
                deny: [
                    PermissionsBitField.Flags.ViewChannel,
                    PermissionsBitField.Flags.CreatePublicThreads,
                    PermissionsBitField.Flags.CreatePrivateThreads
                ]
            },
            // Access Role
            {
                type: OverwriteType.Role,
                id: TicketRoles[ticket.type as TicketTypes],
                allow: [
                    PermissionsBitField.Flags.ViewChannel
                ]
            }
        ]
    });

    return updatedTicket;
};