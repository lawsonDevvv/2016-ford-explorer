import {Events, Listener} from "@sapphire/framework";
import {GuildMember, TextChannel} from "discord.js";
import {ApplyOptions} from "@sapphire/decorators";

@ApplyOptions<Listener.Options>({
    name: "channelLoggerJoinRemove",
    event: Events.GuildMemberRemove
})
export default class extends Listener {
    public async run(member: GuildMember) {
        const channel = member.guild?.channels.cache.get('1278877721094782986') as TextChannel;
        const memberCount = member.guild.memberCount

        this.container.logger.info(`Someone left. :( Member Count: ${memberCount}`);
        return await channel.setName(`Member Count: ${memberCount}`);
    }
}