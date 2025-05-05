import {Events, Listener, ListenerOptions} from "@sapphire/framework";
import {ApplyOptions} from "@sapphire/decorators";
import {Message, TextChannel} from "discord.js";
import {EmbedBuilder} from "@discordjs/builders";

@ApplyOptions<ListenerOptions>({
    event: Events.MessageCreate
})
export default class extends Listener {
    public async run(message: Message) {
        this.container.logger.info(message.content)
        if (message.mentions.members?.has('435525889501954058') || message.mentions.members?.has('608077108492632085')) {
            if (message.member?.roles.cache.has('1238455317860323338')) return;
            if ((message.channel as TextChannel).parent?.id === "1277523499744886824") return;
            if (message.mentions.repliedUser?.id === '435525889501954058' || message.mentions.repliedUser?.id === '608077108492632085') return;
            if (message.author.id === "1252162610875469886") return;
            const embed = new EmbedBuilder()
                .setTitle("Hey! Don't do that!")
                .setDescription(`Pinging the CEO(s) should only be reserved for staff report tickets and/or **cases of extreme necessity**. Pinging the CEO un-necessarily will result in moderation action.`)
                .setFooter({text: 'v6ix Studios 2024'})
                .setColor(0xb70d0d)
                .setTimestamp()
            ;
            return await message.reply({embeds: [embed]});
        }
        return;
    }
}