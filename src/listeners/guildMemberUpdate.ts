import {Events, Listener, ListenerOptions} from "@sapphire/framework";
import {ApplyOptions} from "@sapphire/decorators";
import {GuildMember, TextChannel} from "discord.js";

@ApplyOptions<ListenerOptions>({
    event: Events.GuildMemberUpdate
})
export default class extends Listener {
    public async run(oldMember: GuildMember, newMember: GuildMember) {
        if (!oldMember.roles.cache.has('1219419344589819905') && newMember.roles.cache.has('1219419344589819905')) {
            await newMember.roles.add('1200892438470991914');
            await (newMember.guild.channels.cache.get('1265355234658615296') as TextChannel).send(`${newMember} just received the Member+ rank in ROBLOX. I have adjusted their Discord roles to reflect this.`)
        }
    }
}