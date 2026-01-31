import {ApplyOptions} from "@sapphire/decorators";
import {Events, Listener, ListenerOptions} from "@sapphire/framework";
import {ButtonInteraction, GuildMember, MessageFlags, TextChannel} from "discord.js";
import claimTicket from "../../util/tickets/claimTicket";

@ApplyOptions<ListenerOptions>({
    event: Events.InteractionCreate
})
export default class extends Listener {
    public async run(interaction: ButtonInteraction) {
        if (!interaction.isButton()) return;
        if (interaction.customId !== 'claimTicketButton') return;
        if (!interaction.guild || !(interaction.member instanceof GuildMember)) return;
        if (!(interaction.channel instanceof TextChannel)) return;

        await interaction.deferReply({
            flags: [
                MessageFlags.Ephemeral
            ]
        });

        try {
            await claimTicket(interaction.channel, interaction.member);
            return await interaction.editReply("Ticket claimed.");
        } catch (err: any) {
            if (!(err instanceof Error)) this.container.logger.error(err);
            return await interaction.editReply(`Cylinder 3 Misfire \`\`\`${err instanceof Error ? err.message : err}\`\`\``);
        }
    }
}