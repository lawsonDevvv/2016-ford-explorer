import {Events, Listener} from "@sapphire/framework";
import {ApplyOptions} from "@sapphire/decorators";
import {Role, TextChannel} from "discord.js";

@ApplyOptions<Listener.Options>({
    name: "channelLoggerRoleDelete",
    event: Events.GuildRoleDelete
})
export default class extends Listener {
    public async run(role: Role) {
        const channel = role.guild.channels.cache.get('1278877828208656404') as TextChannel;
        const roleCount: number = role.guild.roles.cache.size;

        this.container.logger.info(`Role deleted, go check audit logs. Role Count: ${roleCount}`);
        return await channel.setName(`Role Count: ${roleCount}`);
    }
}