import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { GuildChannel, Message } from "discord.js";
import { editsnipes } from "../Bot.js";

@ApplyOptions<ListenerOptions>({
    name: "messageUpdate",
    event: "messageUpdate",
})
export default class extends Listener {
    public async run(oldMessage: Message, newMessage: Message): Promise<void> {
        if (oldMessage.author.bot) return;
        if (oldMessage.partial) await oldMessage.fetch();
        if (!oldMessage.guild) return;
        if (!oldMessage.content) return;

        editsnipes.set(oldMessage.channel.id, [oldMessage, newMessage]);
        return this.container.logger.info(`Sniped message edit from ${oldMessage.author.tag} in #${(oldMessage.channel as GuildChannel).name}.`);
    }
}