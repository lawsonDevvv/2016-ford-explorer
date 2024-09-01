import {ApplyOptions} from "@sapphire/decorators";
import {ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior} from "@sapphire/framework";
import {ChatInputCommandInteraction, InteractionResponse, Message, SlashCommandBuilder, TextChannel} from "discord.js";
import {GroupRanks} from "../../util/types";
import * as noblox from 'noblox.js'

@ApplyOptions<CommandOptions>({
    description: "Set someone's rank in the group.",
    preconditions: ["Staff"],
    cooldownDelay: 5000
})
export default class extends Command {
    public async registerApplicationCommands(registry: ApplicationCommandRegistry) {
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption(o =>
                o
                    .setName("username")
                    .setDescription("Username of the person to rank. Ensure this is correct.")
                    .setRequired(true)
            )
            .addStringOption(o =>
                o
                    .setName("rank")
                    .setDescription("The rank to set them to.")
                    .setRequired(true)
                    .addChoices([
                        {
                            name: "Server Booster",
                            value: GroupRanks.ServerBooster
                        },
                        {
                            name: "Member+",
                            value: GroupRanks.MemberPlus
                        },
                        {
                            name: "Member",
                            value: GroupRanks.Member
                        }
                        ]
                    )
            )
        ;

        registry.registerChatInputCommand(builder, {behaviorWhenNotIdentical: RegisterBehavior.Overwrite});
    }

    public async chatInputRun(interaction: ChatInputCommandInteraction): Promise<InteractionResponse<boolean> | Message<boolean>> {
        const username: string = interaction.options.getString("username", true);
        const rank: string = interaction.options.getString("rank", true);
        const robloxId =  await noblox.getIdFromUsername(username);
        const logChannel: TextChannel = interaction.guild?.channels.cache.get('1265355234658615296') as TextChannel;

        if (await noblox.getRankInGroup(parseInt(process.env.CMTZ_GROUP??"0"), robloxId) === 0) {
            return await interaction.reply("Cylinder 6 misfire.\n\`\`\`Target user not in group.\`\`\`");
        }

        await interaction.reply("Hold on. Roblox is slow, this may take a while. If this command doesn't run, try it again.");

        try {
            if (rank === GroupRanks.ServerBooster) {
                await noblox.setRank(parseInt(process.env.CMTZ_GROUP ?? "0"), robloxId, "Booster");
                await logChannel.send(`${username} was given group rank Server Booster by ${interaction.user}.`);
                return await interaction.editReply(`Set \`${username}\`'s rank to Server Booster. Run /update to update roles.`);
            } else if (rank === GroupRanks.MemberPlus) {
                await noblox.setRank(parseInt(process.env.CMTZ_GROUP ?? "0"), robloxId, "M+");
                await logChannel.send(`${username} was given group rank Member+ by ${interaction.user}.`);
                return await interaction.editReply(`Set \`${username}\`'s rank to Member+. Run /update to update roles.`);
            } else if (rank === GroupRanks.Member) {
                await noblox.setRank(parseInt(process.env.CMTZ_GROUP ?? "0"), robloxId, "Member");
                await logChannel.send(`${username} was given group rank Member by ${interaction.user}.`);
                return await interaction.editReply(`Set \`${username}\`'s rank to Member. Run /update to update roles.`);
            }
        } catch (e: any) {
            return await interaction.editReply(`Cylinder 6 misfire.\n\`\`\`${e.name}: ${e.message}\`\`\``);
        }

        return await interaction.editReply("Cylinder 1 misfire. This isn't even supposed to happen. Ping a staff member.");
    }
}