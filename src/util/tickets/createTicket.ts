/**
 * @file createTicket.ts
 * @description Handles ticket creation functionality including channel creation,
 * permission setup, and initial message embedding. This module creates a Discord
 * channel with proper permissions and records the ticket in the database.
 * 
 * @module util/tickets/createTicket
 */

import {Guild, GuildMember, PermissionsBitField, TextChannel} from "discord.js";
import {TicketCategories, TicketEmbedColors, TicketGreetingMessages, TicketRoles, ticketType} from "../types/Tickets";
import {prisma} from "../../Bot";
import {ButtonStyle, ChannelType, OverwriteType} from 'discord-api-types/v10'
import {Ticket, TicketSettings} from "@prisma/client";
import {ActionRowBuilder, ButtonBuilder, EmbedBuilder} from "@discordjs/builders";

const createTicketEmbed = (member: GuildMember, type: ticketType): EmbedBuilder => {
    return new EmbedBuilder()
        .setColor(TicketEmbedColors[type])
        .addFields([
            {
                name: 'User',
                value: `${member}`,
                inline: true
            },
            {
                name: 'Type',
                value: type.charAt(0).toUpperCase() + type.slice(1),
                inline: true
            }
        ])
        .setDescription(TicketGreetingMessages[type]);
};

/**
 * Creates a new ticket channel and associated database entry
 * @param guild - The Discord guild where the ticket will be created
 * @param member - The user who initiated the ticket
 * @param type - The type of ticket being created
 * @returns The created ticket database entry
 * @throws Error if ticket settings are not found for the guild
 */
export default async (guild: Guild, member: GuildMember, type: ticketType): Promise<Ticket> => {
    const ticketSettings: TicketSettings | null = await prisma.ticketSettings.findFirst({ where: { guild: guild.id } });
    if (!ticketSettings) throw new Error(`TicketSettings not found for guild`);
    const number = ticketSettings.ticketCounter + 1;

    const channel: TextChannel = await guild.channels.create({
        name: `ticket-${number}`,
        type: ChannelType.GuildText,
        parent: TicketCategories[type],
        reason: `Ticket opened by @${member.displayName}`,
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
                id: member.id,
                allow: [
                    PermissionsBitField.Flags.ViewChannel
                ],
                deny: [
                    PermissionsBitField.Flags.CreatePublicThreads,
                    PermissionsBitField.Flags.CreatePrivateThreads
                ]
            },
            // Ticket Access Role
            {
                type: OverwriteType.Role,
                id: TicketRoles[type as ticketType],
                allow: [
                    PermissionsBitField.Flags.ViewChannel
                ]
            }
        ]
    });

    const closeButton = new ButtonBuilder()
        .setCustomId('closeTicketButton')
        .setLabel('Close')
        .setStyle(ButtonStyle.Danger);

    const claimButton = new ButtonBuilder()
        .setCustomId('claimTicketButton')
        .setLabel('Claim')
        .setStyle(ButtonStyle.Success);

    const actionRow = new ActionRowBuilder<ButtonBuilder>()
        .addComponents([closeButton, claimButton]);

    const ticket: Ticket = await prisma.ticket.create({ data: { guild: guild.id, channel: channel.id, user: member.id, type, number } });
    await prisma.ticketSettings.update({ where: { guild: guild.id }, data: { ticketCounter: number } });

    await channel.send({
        content: `${member}` + `<@&${TicketRoles[type]}>`,
        embeds: [createTicketEmbed(member, type)],
        components: [actionRow]
    });

    return ticket;
}