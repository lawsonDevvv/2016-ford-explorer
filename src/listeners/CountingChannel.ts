import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Message } from "discord.js";
import { prisma } from "../Bot";

@ApplyOptions<ListenerOptions>({
    event: Events.MessageCreate
})
export default class extends Listener {
    public async run(message: Message): Promise<void> {
        // Check if the message is in a guild (not a DM)
        if (!message.guild) return;

        // If not in the specific counting channel, abort
        if (message.channel.id !== "1281993412396191847") return;
        if (message.author.bot) return;

        const regex = /^([0-9]|[1-9][0-9]{1,7}|100000000)$/;

        if (!regex.test(message.content)) {
            try {
                await message.delete();
            } catch (err) {
                this.container.logger.error("Failed to delete message:", err);
            }
            return;
        }

        const numberContent = parseInt(message.content, 10);
        if (isNaN(numberContent)) return;

        const countingSettings = await prisma.counting.findFirst({ where: { server: message.guild.id } });
        if (!countingSettings) return;

        const updateData = {
            countedAt: new Date(),
            lastCounter: message.author.id,
            currentNumber: countingSettings?.currentNumber === numberContent - 1 ? numberContent : 0
        };

        try {
            await prisma.counting.update({
                where: { server: message.guild.id },
                data: updateData
            });

            if (updateData.currentNumber === 0) {
                try {
                    await message.react("👎");
                } catch (err) {
                    this.container.logger.warn("Failed to react with 👎:", err);
                }
                await message.reply("Cylinder 3 misfire.\n```You counted wrong. Back to 0.```");
            } else {
                try {
                    await message.react("👍");
                } catch (err) {
                    this.container.logger.warn("Failed to react with 👍:", err);
                }
                this.container.logger.info(`Counter increased by ${message.author.username} to ${numberContent}.`);
            }
        } catch (err) {
            await message.reply("There was an error updating the counter database.");
            this.container.logger.error(err);
        }
    }
}
