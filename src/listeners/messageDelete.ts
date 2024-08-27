import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import {GuildChannel, Message, TextChannel} from "discord.js";
import { snipes } from "../Bot.js";
import {EmbedBuilder} from "@discordjs/builders";

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

        // Message Logger
        const logChannel: TextChannel = message.guild.channels.cache.get('1200906487728439426') as TextChannel;
        const embed: EmbedBuilder = new EmbedBuilder()
            .setTitle("Message Deleted")
            .setTimestamp(Date.now())
            .setDescription(
                `**Channel:** ${message.channel}\n` +
                `**ID:** ${message.channel.id}\n` +
                `**Content:**\n` +
                `\`\`\`diff\n- ${message.content}\n\`\`\`\n` +
                `**Author:** ${message.author} \`${message.author.id}\`\n`
            )
        ;

        if (message.attachments.size > 0) {
            embed.setImage(message.attachments.first()?.proxyURL!);
        }

        await logChannel.send({embeds: [embed]})

        // Message Sniper
        snipes.set(message.channel.id, message);
        this.container.logger.info(`Sniped message from ${message.author.tag} in #${(message.channel as GuildChannel).name}`);
    }
}