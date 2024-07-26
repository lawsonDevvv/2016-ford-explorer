import {ApplyOptions} from "@sapphire/decorators";
import {Events, Listener, ListenerOptions} from "@sapphire/framework";
import {GuildMember, TextChannel} from "discord.js";
import {EmbedBuilder} from "@discordjs/builders";

@ApplyOptions<ListenerOptions>({
    event: Events.GuildMemberAdd
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
                }
            ])
            .setFooter({text: "Guild Member Added"})
            .setColor(0x08FF00)
        ;

        await channel.send({embeds: [embed]})
    }
}