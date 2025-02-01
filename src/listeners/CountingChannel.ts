import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import {EmojiIdentifierResolvable, Message} from "discord.js";
import { prisma } from "../Bot";

@ApplyOptions<ListenerOptions>({
    event: Events.MessageCreate
})
export default class extends Listener {
    public async run(message: Message): Promise<void> {
        // Check if the message is in a guild (not a DM)
        if (!message.guild || !message.member|| message.author.bot || message.channel.id !== "1281993412396191847") return;

        const regex = /^([0-9]|[1-9][0-9]{1,7}|100000000)$/;

        // If message doesn't match the counting format, delete it
        if (!regex.test(message.content)) {
            try {
                if (!message.member.roles.cache.has("1238455317860323338")) await message.delete();
            } catch (err) {
                this.container.logger.error("Failed to delete message:", err);
            }
            return;
        }

        // Parse message content to a number
        const numberContent = parseInt(message.content, 10);
        if (isNaN(numberContent)) return;

        // Fetch counting settings from the database
        const countingSettings = await prisma.counting.findFirst({ where: { server: message.guild.id } });
        if (!countingSettings) return;

        // Prepare data for updating the database
        const updateData = {
            countedAt: new Date(),
            lastCounter: message.author.id,
            currentNumber: countingSettings.currentNumber === numberContent - 1 ? numberContent : 0
        };

        try {
            // Prevent the same user from counting twice in a row
            if (updateData.lastCounter === countingSettings.lastCounter) {
                await message.reply("Cylinder 3 misfire. ```You can't count twice. Back to 0.```");
                updateData.lastCounter = countingSettings.lastCounter;
                updateData.currentNumber = 0;
                await this.updateCounter(message.guild.id, updateData);
                return;
            }

            // Update the counter in the database
            await this.updateCounter(message.guild.id, updateData);

            if (updateData.currentNumber === 0) {
                await this.reactToMessage(message, "👎");
                await message.reply("Cylinder 3 misfire.\n```You counted wrong. Back to 0.```");
            } else {
                await this.reactToMessage(message, "👍");
                if (countingSettings.countingRecord < numberContent) {
                    prisma.counting.update({
                        where: {
                            server: message.guild.id
                        },
                        data: {
                            countingRecord: numberContent
                        },
                    })
                }
                this.container.logger.info(`Counter increased by ${message.author.username} to ${numberContent}.`);
            }
        } catch (err) {
            await message.reply("There was an error updating the counter database.");
            this.container.logger.error(err);
        }
    }

    // Helper function to update the counter in the database
    private async updateCounter(serverId: string, data: { countedAt: Date; lastCounter: string; currentNumber: number }) {
        try {
            await prisma.counting.update({
                where: { server: serverId },
                data: data
            });
        } catch (err) {
            this.container.logger.error("Failed to update the counter:", err);
            throw err; // Rethrow the error to handle it in the calling function
        }
    }

    // Helper function to react to a message
    private async reactToMessage(message: Message, emoji: EmojiIdentifierResolvable): Promise<void> {
        try {
            await message.react(emoji)
            await Promise.resolve()
        } catch (err) {
            this.container.logger.warn(`Failed to react with ${emoji}:`, err);
            await Promise.reject(err);
        }
    }
}
