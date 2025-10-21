import {Events, Listener, ListenerOptions} from "@sapphire/framework";
import {ApplyOptions} from "@sapphire/decorators";
import {Message, TextChannel} from "discord.js";
import {EmbedBuilder} from "@discordjs/builders";
import {prisma} from "../Bot";

@ApplyOptions<ListenerOptions>({
    event: Events.MessageDelete
})
export default class extends Listener {
    public async run(message: Message): Promise<Message<boolean> | void> {
        if (message.channel.id !== "1281993412396191847") return;
        if (message.author.bot) return;
        if (!message.guild) return;
        const countingChannel = message.guild.channels.cache.get("1281993412396191847")
        if (!countingChannel) throw new Error("CountingChannelDeleteLogger: Could not fetch channel.")
        if (!(countingChannel instanceof TextChannel)) throw new Error("CountingChannelDeleteLogger: Counting channel is not an instance of TextChannel")
        const counting = await prisma.counting.findFirstOrThrow({
            where: {
                server: message.guild.id
            }
        }).catch((e: any) => {
            this.container.logger.error(e);
            return;
        })

        if (!counting) return;

        const regex = /^([0-9]|[1-9][0-9]{1,7}|100000000)$/;

        if (regex.test(message.content)) {
            const embed = new EmbedBuilder()
                .setTitle("You are NOT low")
                .setDescription(`\`\`\`diff\nNumber Deleted:\n- ${message.content}\n\`\`\`Current Number: ${counting.currentNumber} | Next Number: ${counting.currentNumber + 1}`)
                .setAuthor({iconURL: message.author.displayAvatarURL({ forceStatic: false }), name: message.author.username})
                .setFooter({text: "He tried to get low but I already peeped him..."})
            return await countingChannel.send({embeds: [embed]});
        } else {
            return;
        }
    }
}