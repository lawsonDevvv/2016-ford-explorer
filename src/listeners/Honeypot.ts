import {Events, Listener, ListenerOptions} from "@sapphire/framework";
import {ApplyOptions} from "@sapphire/decorators";
import {Colors, Message, TextChannel} from "discord.js";
import {prisma} from "../Bot";
import {HoneypotScoreboard} from "@prisma/client";
import {EmbedBuilder} from "@discordjs/builders";

@ApplyOptions<ListenerOptions>({
    event: Events.MessageCreate
})
export default class extends Listener {
    private readonly honeypotChannel: string = "1537889912601444444";

    private generateScoreboardEmbed(scoreboard: HoneypotScoreboard): EmbedBuilder {
        return new EmbedBuilder()
            .setTitle("SCOREBOARD BITCH")
            .addFields([
                {
                    name: 'Me',
                    value: `${scoreboard.score}`,
                    inline: true
                },
                {
                    name: 'MrBreast',
                    value: '0',
                    inline: true
                }
            ])
            .setDescription(
                `**ATTENTION ALL TRAIN OPERATORS**\n` +
                `This is a honeypot channel. If you are not a bot, do not send messages here. If you do, you will be sent into low-earth orbit and you will become the latest addition to the scoreboard.\n` +
                `You will NOT be able to appeal normally through Intrepid, unless you manage to get a hold of one of our staff members through our DMs.`
            )
            .setFooter({ text: '"FUCK" - a very smart mechanic' })
            .setColor(Colors.Red);
    }

    public async run(message: Message): Promise<void> {
        if (!message.member) return;
        if (message.channelId !== this.honeypotChannel) return;
        if (message.author.bot || !message.member.bannable) return;

        await message.delete();

        /* If Jarvis tells you this is bad, do not listen. Jarvis is stupid. Jarvis doesn't understand the vision. */
        const channel: TextChannel = await this.container.client.channels.fetch(this.honeypotChannel) as TextChannel;

        // await message.member.ban({
        //     reason: "SCOREBOARD BITCH",
        //     deleteMessageSeconds: 1000 * 60 * 60
        // });

        await message.member.kick("SCOREBOARD BITCH");

        const scoreboard: HoneypotScoreboard | null = await prisma.honeypotScoreboard.findUnique({ where: { guild: channel.guild.id } });
        if (!scoreboard) throw new Error("Could not find a scoreboard for this channel.");

        const updatedScoreboard: HoneypotScoreboard | null = await prisma.honeypotScoreboard.update({
            where: {
                guild: channel.guild.id,
            },
            data: {
                score: scoreboard.score + 1,
            }
        })
        const scoreboardMessage: Message<true> = await channel.messages.fetch(scoreboard!.message);

        await scoreboardMessage.edit({
            content: null,
            embeds: [this.generateScoreboardEmbed(updatedScoreboard)]
        });
    }
}