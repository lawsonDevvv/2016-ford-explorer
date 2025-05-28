import {Colors, GuildMember, OverwriteType, PermissionsBitField, TextChannel} from "discord.js";
import {EmbedBuilder} from "@discordjs/builders";
import {Ticket} from "@prisma/client";
import {prisma} from "../../Bot";
import {TicketRoles, TicketStatus, TicketTypes} from "../types/Tickets";

const createReopenEmbed = (openedBy: GuildMember): EmbedBuilder => {
    return new EmbedBuilder()
        .setColor(Colors.Grey) // Red color for closed tickets
        .setDescription(`Ticket opened by ${openedBy}.`);
};

export default async (channel: TextChannel, member: GuildMember) => {
    const ticket: Ticket | null = await prisma.ticket.findFirst({
        where: {
            guild: member.guild.id,
            channel: channel.id
        }
    });

    if (!ticket) throw new Error(`Ticket not found for channel ${channel.name}`);

    if (ticket.status === TicketStatus.Open) throw new Error(`Ticket ${ticket.number} is already open.`);

    const updatedTicket = await prisma.ticket.update({
        where: {
            id: ticket.id
        },
        data: {
            status: TicketStatus.Open,
            closedBy: null,
            closedAt: null,
            closedReason: null
        }
    });

    await channel.edit({
        name: `ticket-${ticket.number}`,
        permissionOverwrites: [
            // @everyone
            {
                type: OverwriteType.Role,
                id: member.guild.id,
                deny: [
                    PermissionsBitField.Flags.ViewChannel
                ]
            },
            // Ticket User
            {
                type: OverwriteType.Member,
                id: ticket.user,
                allow: [
                    PermissionsBitField.Flags.ViewChannel
                ],
                deny: [
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
    })

    await channel.send({
        embeds: [createReopenEmbed(member)]
    });

    return updatedTicket;
}