import {ApplyOptions} from "@sapphire/decorators";
import {Events, Listener, ListenerOptions} from "@sapphire/framework";
import {GuildMember, MessageFlags, StringSelectMenuInteraction} from "discord.js";
import createTicket from "../../util/tickets/createTicket";
import {ticketType} from "../../util/types/Tickets";
import {Ticket} from "@prisma/client";

@ApplyOptions<ListenerOptions>({
    event: Events.InteractionCreate
})
export default class extends Listener {
    public async run(interaction: StringSelectMenuInteraction) {
        if (!interaction.isStringSelectMenu()) return;
        if (interaction.customId !== "createTicketButton") return;
        if (!interaction.guild || !interaction.member) return;

        await interaction.deferReply();

        const member = interaction.member as GuildMember;

        if (member.roles.cache.has('1373746940214509740')) return await interaction.reply({
            content: "You are ticket blacklisted. No ticket for you :(",
            flags: [
                MessageFlags.Ephemeral
            ],
            tts: true
        });

        const ticket: Ticket = await createTicket(interaction.guild, member, interaction.values[0] as ticketType);
        return await interaction.reply({
            content: `Your ticket has been created. <#${ticket.channel}>`,
            flags: [
                MessageFlags.Ephemeral
            ]
        });
    }
}