import {Events, Listener, ListenerOptions} from "@sapphire/framework";
import {GuildMember, TextChannel} from "discord.js";
import {ApplyOptions} from "@sapphire/decorators";

@ApplyOptions<ListenerOptions>({
    event: Events.GuildMemberUpdate
})
export default class extends Listener {
    public async run(oldMember: GuildMember, newMember: GuildMember): Promise<void> {
        const premiumRole = oldMember.guild.roles.premiumSubscriberRole;
        if (!premiumRole) throw new Error("Guild's PremiumRole was not found.");

        if (!oldMember.roles.cache.has(premiumRole.id) && newMember.roles.cache.has(premiumRole.id)) {
            const channel = this.container.client.channels.cache.get("1323145054960750635");

            if (!channel) throw new Error("Server boost logging channel not found.");
            if (!(channel instanceof TextChannel)) {
                throw new Error("Server boost logging channel is not an instance of TextChannel.");
            }

            await channel.send(`<@${oldMember.id}> has started boosting the server.`)
                .catch((reason: any): void => {
                    this.container.logger.error(reason);
                });
        }
    }
}