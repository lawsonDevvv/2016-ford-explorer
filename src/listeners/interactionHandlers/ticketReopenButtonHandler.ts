import {ApplyOptions} from "@sapphire/decorators";
import {Events, Listener, ListenerOptions} from "@sapphire/framework";
import {ButtonInteraction, GuildMember, Message, MessageFlags, TextChannel} from "discord.js";
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

        await interaction.deferReply({
            flags: [
                MessageFlags.Ephemeral
            ]
        });

        await reopenTicket(interaction.channel, interaction.member as GuildMember)
            .catch(async (e: any): Promise<Message> => {
                this.container.logger.error(e);
                return await interaction.editReply({
                    content: `Cylinder 6 Misfire \`\`\`${e.message ?? e}\`\`\``
                });
            });

        return await interaction.editReply({
            content: "Ticket opened."
        })
    }
}