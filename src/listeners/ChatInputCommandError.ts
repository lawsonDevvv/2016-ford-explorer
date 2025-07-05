import {ChatInputCommandErrorPayload, Events, Listener, ListenerOptions} from "@sapphire/framework";
import {ApplyOptions} from "@sapphire/decorators";
import {ChatInputCommandInteraction} from "discord.js";

@ApplyOptions<ListenerOptions>({
    event: Events.ChatInputCommandError
})
export default class extends Listener {
    public async run(err: any, payload: ChatInputCommandErrorPayload, interaction: ChatInputCommandInteraction = payload.interaction) {
        interaction.replied
            ? await interaction.editReply({
                content: `Cylinder 6 Misfire\`\`\`${err}\`\`\``
            })
            : await interaction.reply({
                content: `Cylinder 6 Misfire\`\`\`${err}\`\`\``
            });
    }
}