import {ApplyOptions} from "@sapphire/decorators";
import {Events, Listener, ListenerOptions} from "@sapphire/framework";
import {ButtonInteraction, MessageFlags, TextChannel} from "discord.js";
import {prisma} from "../../Bot";

@ApplyOptions<ListenerOptions>({
    event: Events.InteractionCreate
})
export default class extends Listener {
    public async run(interaction: ButtonInteraction) {
        if (!interaction.isButton()) return;
        if (!interaction.guild || !interaction.member) return;
        if (!(interaction.channel instanceof TextChannel)) return;

        await interaction.deferReply({
            flags: [
                MessageFlags.Ephemeral
            ]
        });

        const ticket = await prisma.ticket.findFirst({
            where: {
                channel: interaction.channel.id
            }
        });

        if (!ticket) return interaction.editReply({
            content: "This channel is not a ticket."
        });

        if (ticket.claimedBy === interaction.user.id) return interaction.editReply({
            content: "You cannot claim this ticket twice (that would be silly)!"
        });

        if (ticket.claimedBy && ticket.claimedBy !== interaction.user.id) return interaction.editReply({
            content: "This ticket has already been claimed by another staff member."
        });

        await prisma.ticket.update({
            where: {
                id: ticket.id
            },
            data: {
                claimedBy: interaction.user.id,
            }
        });

        return await interaction.editReply({
            content: "Claimed ticket."
        });
    }
}