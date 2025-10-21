import {ChatInputCommandErrorPayload, Events, Listener, ListenerOptions} from "@sapphire/framework";
import {ApplyOptions} from "@sapphire/decorators";
import {ChatInputCommandInteraction, TextChannel} from "discord.js";

@ApplyOptions<ListenerOptions>({
    event: Events.ChatInputCommandError
})
export default class extends Listener {
    public async run(err: any, payload: ChatInputCommandErrorPayload, interaction: ChatInputCommandInteraction = payload.interaction): Promise<void> {
        const channel = await interaction.guild!.channels.fetch('1350301566455906355');
        if (!(channel instanceof TextChannel)) return;

        await channel.send(`An error occured while ${interaction.user.username} was running /${payload.command.name} \`\`\`${err}\`\`\``);

        interaction.replied
            ? await interaction.editReply({
                content: `Cylinder 6 Misfire\`\`\`${err}\`\`\``
            })
            : await interaction.reply({
                content: `Cylinder 6 Misfire\`\`\`${err}\`\`\``
            });
    }
}