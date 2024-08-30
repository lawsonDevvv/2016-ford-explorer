import { Events, Listener} from "@sapphire/framework";
import {ApplyOptions} from "@sapphire/decorators";
import {GuildMember, TextChannel} from "discord.js";
@ApplyOptions<Listener.Options>({
    name: "channelLoggerJoinAdd",
    event: Events.GuildMemberAdd
})
export default class extends Listener {
    public async run(member: GuildMember) {
        const channel = member.guild?.channels.cache.get('1278877721094782986') as TextChannel;
        const memberCount = member.guild.memberCount

        this.container.logger.info(`Someone joined! Member Count: ${memberCount}`);
        return await channel.setName(`Member Count: ${memberCount}`);
    }
}