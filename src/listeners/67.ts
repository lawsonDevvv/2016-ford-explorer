import {Events, Listener, ListenerOptions} from "@sapphire/framework";
import {Message} from "discord.js";
import {ApplyOptions} from "@sapphire/decorators";
import {TicketCategories} from "../util/types/Tickets";

@ApplyOptions<ListenerOptions>({
    enabled: false,
    event: Events.MessageCreate
})
export default class SixSeven extends Listener {
    private readonly sixSevenGifs: string[] = [
        "https://tenor.com/view/bosnov-67-bosnov-67-67-meme-gif-16727368109953357722",
        "https://tenor.com/view/sixseven-six-seven-six-seve-67-gif-14143337669032958349",
        "https://tenor.com/view/south-park-67-67-south-park-67-south-park-6-7-gif-13284396363591354590",
        "https://tenor.com/view/shaquille-o%27neal-shaq-67-6-7-gif-5184942973847308913",
        "https://tenor.com/view/cat-67-scp-67-funyuns-funny-gif-75413186200073602",
        "https://tenor.com/view/67-67-meme-67-umpire-umpire-mlb-gif-16280715357512483999",
        "https://tenor.com/view/67-gif-8575841764206736991"
    ];
    private readonly sixSevenTriggerPhrases: string[] = ["67", "6 7", "6  7", "six 7", "six seven", "sixty seven", "six-seven", "sixty 7", "LXVII", "60 + 7", "60+7", "6 seven", "seis siete", "6.7", "6,7", "74 - 7", "74-7"];

    public async run(message: Message<true>): Promise<Message<true> | undefined> {
        if (!message.guild) return;
        if (message.author.id === this.container.client.user!.id) return;
        if (message.channel.parent && Object.values(TicketCategories).includes(message.channel.parent.id)) return;

        const triggered: boolean = this.sixSevenTriggerPhrases.some((phrase: string): boolean =>
            message.content.toLowerCase().includes(phrase.toLowerCase())
        );
        if (!triggered) return;

        const i: number = Math.floor(Math.random() * this.sixSevenGifs.length);
        return await message.reply(this.sixSevenGifs[i]);
    }
}