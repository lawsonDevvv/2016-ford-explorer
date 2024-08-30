import {Events, Listener} from "@sapphire/framework";
import {ApplyOptions} from "@sapphire/decorators";
import {Channel, GuildChannel, TextChannel} from "discord.js";

@ApplyOptions<Listener.Options>({
    name: "ChannelLoggerChannelDelete",
    event: Events.ChannelDelete,
})
export default class extends Listener {
    public async run(c: (Channel)) {
        const channel = (c as GuildChannel).guild.channels.cache.get('1278877952301469766') as TextChannel;
        const channelCount: number = (c as GuildChannel).guild.channels.cache.size;

        this.container.logger.info(`Channel deleted. Channel Count: ${channelCount}`);
        return await channel.setName(`Channel Count: ${channelCount}`);
    }
}