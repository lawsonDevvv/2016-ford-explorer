import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import { ButtonInteraction, TextChannel } from "discord.js";
import { ApplyOptions } from "@sapphire/decorators";
import deleteTicket from "../../util/tickets/deleteTicket";

@ApplyOptions<ListenerOptions>({
    event: Events.InteractionCreate
})
export default class extends Listener {
    async run(interaction: ButtonInteraction) {
        if (!interaction.isButton()) return;
        if (interaction.customId !== 'deleteTicketButton') return;
        if (!interaction.guild || !interaction.member) return;
        if (!(interaction.channel instanceof TextChannel)) return;

        await interaction.deferReply();
        await interaction.reply("This ticket will be deleted in 5 seconds, please standby while I process your request.");

        setTimeout(async () => {
            await deleteTicket();
        }, 5000);
    }
}