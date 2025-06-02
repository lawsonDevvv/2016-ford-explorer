import {ApplyOptions} from "@sapphire/decorators";
import {Events, Listener, ListenerOptions} from "@sapphire/framework";
import {ButtonInteraction, GuildMember, MessageFlags, TextChannel} from "discord.js";
import closeTicket from "../../util/tickets/closeTicket";
import generateTranscript from "../../util/tickets/generateTranscript";

@ApplyOptions<ListenerOptions>({
    event: Events.InteractionCreate
})
export default class extends Listener {
    public async run(interaction: ButtonInteraction) {
        if (!interaction.isButton()) return;
        if (interaction.customId !== "closeTicketButton") return;
        if (!interaction.guild || !interaction.member) return;

        await interaction.deferReply({
            flags: [
                MessageFlags.Ephemeral
            ]
        });

        const member = interaction.member as GuildMember;

        try {
            await closeTicket(interaction.guild, interaction.channel as TextChannel, member, 'No reason specified.');
            await generateTranscript(interaction.channel as TextChannel);
            
            return await interaction.editReply({
                content: "Ticket closed."
            });
        } catch (e) {
            this.container.logger.error(e);
            return await interaction.editReply({
                content: `Cylinder 6 Misfire \`\`\`${e instanceof Error ? e.message : String(e)}\`\`\``
            });
        }
    }
}