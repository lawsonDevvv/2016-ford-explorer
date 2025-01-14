import {ApplyOptions} from "@sapphire/decorators";
import {ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior} from "@sapphire/framework";
import {
    ChatInputCommandInteraction,
    GuildMember,
    InteractionResponse,
    SlashCommandBuilder
} from "discord.js";
import * as noblox from 'noblox.js';

@ApplyOptions<CommandOptions>({
    description: "Check if they own the Member+ pass.",
    cooldownDelay: 15000,
    preconditions: ['Staff']
})
export default class extends Command {
    public registerApplicationCommands(registry: ApplicationCommandRegistry): void {
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption(o =>
                o
                    .setName("username")
                    .setDescription("Mention the person you want to inventory check.")
                    .setRequired(true)
            )
            .addUserOption(o =>
                o
                    .setName("discord_user")
                    .setDescription("Mention the person you want to inventory check.")
                    .setRequired(false)
            )
        ;

        registry.registerChatInputCommand(builder, {behaviorWhenNotIdentical: RegisterBehavior.Overwrite});
    }

    public async chatInputRun(interaction: ChatInputCommandInteraction): Promise<void | InteractionResponse<boolean>> {
        const username: string = interaction.options.getString("username", true);
        let robloxId: number;

        try {
            robloxId = await noblox.getIdFromUsername(username);
        } catch (error) {
            return await interaction.reply(`:x: Input did not return a valid Roblox user ID. Make sure you are typing their actual username (not their display name) and **not pinging them**, and that the username is correct.`);
        }

        const user = interaction.options.getMember("discord_user") as GuildMember;
        let ownsGamePass: boolean = await noblox.getOwnership(robloxId, 696671931, "GamePass")
        if (await noblox.getRankInGroup(parseInt(process.env.CMTZ_GROUP??"0"), robloxId) > 1) {
            return await interaction.reply(":question: User is already above rank 2 (above Member). Are you running this command on the right user?")
        }
        await interaction.reply("Hold on. Roblox is slow, this may take a while..")

        if (ownsGamePass) {
            return noblox.changeRank(parseInt(process.env.CMTZ_GROUP??"0"), robloxId, 1)
                .then(async _ => {
                    if (user) {
                        user.roles.add(['1200892438470991914', '1219419344589819905'])
                            .catch(async __ => {
                                return interaction.editReply(`Cylinder 6 Misfire\n\nRanked ${username} in the group, but failed to set their Discord roles.`)
                            })
                    }
                    await interaction.editReply(`:thumbsup: Changed ${username}'s rank from Member to Member+.`);
                })
                .catch(async (err: Error) => {
                    await interaction.editReply(`Cylinder 6 misfire.\n\`\`\`${err.name}: ${err.message}\`\`\``)
                    this.container.logger.error(err);
                })
        } else {
            return await interaction.editReply(`:thumbsdown: I didn't find the Member+ asset ID in their inventory.`)
        }


    }
}