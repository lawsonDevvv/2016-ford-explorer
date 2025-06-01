import {ApplyOptions} from "@sapphire/decorators";
import {Events, Listener, ListenerOptions} from "@sapphire/framework";
import {ButtonInteraction, GuildMember, MessageFlags, TextChannel} from "discord.js";
import reopenTicket from "../../util/tickets/reopenTicket";

@ApplyOptions<ListenerOptions>({
    event: Events.InteractionCreate
})
export default class extends Listener {
    public async run(interaction: ButtonInteraction) {
        if (!interaction.isButton()) return;
        if (interaction.customId !== "reopenTicketButton") return;
        if (!interaction.guild || !interaction.member) return;
        if (!(interaction.channel instanceof TextChannel)) return;

        await reopenTicket(interaction.channel, interaction.member as GuildMember)
            .catch(async (e) => {
                this.container.logger.error(e);
                return await interaction.reply(`Cylinder 6 Misfire \`\`\`${e.message ?? e}\`\`\``);
            });

        return await interaction.reply({
            content: "Ticket opened.",
            flags: [
                MessageFlags.Ephemeral
            ]
        })
    }
}