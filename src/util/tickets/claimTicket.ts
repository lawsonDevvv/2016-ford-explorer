import {Colors, EmbedBuilder, GuildMember, TextChannel} from "discord.js";
import {Ticket} from "@prisma/client";
import {prisma} from "../../Bot";

export default async (channel: TextChannel, user: GuildMember) => {
    if (!user.roles.cache.has('1238455317860323338')) throw new Error("Why would you want to claim your own ticket?");
    const ticket: Ticket | null = await prisma.ticket.findFirst({
        where: {
            channel: channel.id
        }
    });
    if (!ticket) throw new Error("404 Ticket not found");

    if (ticket.claimedBy !== null && ticket.claimedBy !== user.id) throw new Error("Ticket was claimed by another staff member")
    if (ticket.claimedBy === user.id) throw new Error("You cannot claim a ticket twice, that would be silly!");

    const updatedTicket: Ticket = await prisma.ticket.update({
        where: {
             id: ticket.id
        },
        data: {
            claimedBy: user.id
        }
    });

    const claimedEmbed = new EmbedBuilder()
        .setDescription(`Ticket claimed by ${user}.`)
        .setColor(Colors.Blue);

    await channel.setName(`claimed-${ticket.number}`);
    await channel.send({ embeds: [claimedEmbed] });

    return updatedTicket;
}