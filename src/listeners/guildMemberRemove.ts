import {Events, Listener, ListenerOptions} from "@sapphire/framework";
import {ApplyOptions} from "@sapphire/decorators";
import {GuildMember, TextChannel} from "discord.js";
import {EmbedBuilder} from "@discordjs/builders";
import suffix from "../util/suffix";

@ApplyOptions<ListenerOptions>({
    event: Events.GuildMemberRemove
})
export default class extends Listener {
    public async run(member: GuildMember) {
        const channel = member.guild.channels.cache.get('1265193682986991763') as TextChannel;

        const embed = new EmbedBuilder()
            .setAuthor({name: `${member.user.username} (${member.id})`, iconURL: member.user.displayAvatarURL()})
            .addFields([
                {
                    name: "Creation Date",
                    value: `${member.user.createdAt}`
                },
                {
                    name: "Join Date",
                    value: `${member.joinedAt}`
                }
            ])
            .setFooter({text: `Now have ${suffix(member.guild.memberCount)} members`})
            .setColor(0xFF0000)
        ;

        await channel.send({embeds: [embed]})
    }
}