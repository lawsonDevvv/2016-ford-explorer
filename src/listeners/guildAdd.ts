import {Listener} from "@sapphire/framework";
import {Guild} from "discord.js";

export class GuildAdd extends Listener {
    public async run(guild: Guild) {
        console.log(`Joined guild ${guild.id}: ${guild.name} with ${guild.memberCount} members.`);
    }
}