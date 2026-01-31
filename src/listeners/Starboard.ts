import {Events, Listener, ListenerOptions} from "@sapphire/framework";
import {ApplyOptions} from "@sapphire/decorators";
import {
    Colors,
    EmbedBuilder,
    Message,
    MessageReaction,
    MessageReactionEventDetails,
    ReactionType,
    TextChannel,
    User
} from "discord.js";
import {StarboardEntry} from "@prisma/client";
import {prisma} from "../Bot";

@ApplyOptions<ListenerOptions>({
    event: Events.MessageReactionAdd
})
export default class extends Listener {
    private readonly minimumReactions: number = 1;
    private readonly starboardChannel: string = "1445880837211033660";

    private generateStarboardEmbed(message: Message): EmbedBuilder {
        return new EmbedBuilder()
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ forceStatic: false }) })
            .setDescription(message.content)
            .addFields([
                {
                    name: "Jump To Message",
                    value: `[Beam me up!](${message.url})`
                }
            ])
            .setImage(message.attachments.first()?.url ?? null)
            .setTimestamp()
            .setFooter({ text: message.id })
            .setColor(Colors.LuminousVividPink);
    }

    public async run(messageReaction: MessageReaction, _user: User, details: MessageReactionEventDetails) {
        if (!messageReaction.message.guild) return console.log(1);
        if (messageReaction.emoji.name !== "⭐" && messageReaction.emoji.name !== "🌟") return;
        if (details.type !== ReactionType.Normal) return;
        if (messageReaction.count > this.minimumReactions) return;

        const existingStarboardEntry: StarboardEntry | null = await prisma.starboardEntry.findFirst({
            where: {
                messageId: messageReaction.message.id
            }
        });
        const starboardChannel: TextChannel | null = await messageReaction.message.guild.channels.fetch(this.starboardChannel) as TextChannel;
        if (!starboardChannel) throw new Error("Starboard channel does not exist");

        if (existingStarboardEntry) {
            const starboardMessage: Message<true> = await starboardChannel.messages.fetch(existingStarboardEntry.messageId);

            await prisma.starboardEntry.update({
                where: {
                    id: existingStarboardEntry.id
                },
                data: {
                    stars: messageReaction.count
                }
            });

            return await starboardMessage.edit({
                content: `**${messageReaction.count}** :star2:`,
                embeds: [
                    this.generateStarboardEmbed(messageReaction.message as Message<true>)
                ]
            });
        } else {
            await prisma.starboardEntry.create({
                data: {
                    messageId: messageReaction.message.id,
                    stars: messageReaction.count
                }
            });

            return await starboardChannel.send({
                content: `**${messageReaction.count}** :star2:`,
                embeds: [
                    this.generateStarboardEmbed(messageReaction.message as Message<true>)
                ]
            });
        }

    }
}