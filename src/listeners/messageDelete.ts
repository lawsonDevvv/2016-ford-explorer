import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import { GuildChannel, Message } from "discord.js";
import { snipes } from "../Bot.js";

@ApplyOptions<ListenerOptions>({
    name: "messageDelete",
    event: Events.MessageDelete,
})
export default class extends Listener {
    public async run(message: Message) {
        if (message.author.bot) return;
        if (message.partial) await message.fetch();
        if (!message.guild) return;
        if (!message.content) return;

        snipes.set(message.channel.id, message);
        return this.container.logger.info(`Sniped message from ${message.author.tag} in #${(message.channel as GuildChannel).name}`);
    }
}