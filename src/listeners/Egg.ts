import {Events, Listener, ListenerOptions} from "@sapphire/framework";
import {ApplyOptions} from "@sapphire/decorators";
import {Message, MessageReaction} from "discord.js";

@ApplyOptions<ListenerOptions>({
    event: Events.MessageCreate
})
export default class extends Listener {
    public eggUserId: string = "1056784701718802472";

    public async run(message: Message): Promise<MessageReaction | void> {
        if (message.author.id !== this.eggUserId || !message.content.toLowerCase().includes("egg")) return;

        return message.react("🥚");
    }
}