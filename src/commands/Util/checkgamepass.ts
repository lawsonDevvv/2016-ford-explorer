import {ApplyOptions} from "@sapphire/decorators";
import {ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior} from "@sapphire/framework";
import {Awaitable, ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import * as noblox from 'noblox.js';

@ApplyOptions<CommandOptions>({
    description: "View a list of CMTZ gamepasses they own.",
    cooldownDelay: 15000,
    preconditions: ['Staff']
})
export default class extends Command {
    public registerApplicationCommands(registry: ApplicationCommandRegistry): Awaitable<void> {
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption(o =>
                o
                    .setName("roblox_username")
                    .setDescription("The username of the person you want to inventory check.")
                    .setRequired(true)
            )
        registry.registerChatInputCommand(builder, {behaviorWhenNotIdentical: RegisterBehavior.Overwrite});
    }

    public async chatInputRun(interaction: ChatInputCommandInteraction): Promise<InteractionResponse<boolean> | null> {
        const robloxUsername = interaction.options.getString("roblox_username", true)
        const robloxId = await noblox.getIdFromUsername(robloxUsername)
        let ownsGamePass = await noblox.getOwnership(robloxId, 696671931, "GamePass")
        if (await noblox.getRankInGroup(parseInt(process.env.CMTZ_GROUP??"0"), robloxId) > 1) {
            return await interaction.reply(":question: User is already above rank 2 (above Member). Are you running this command on the right user?")
        }
        await interaction.reply("Hold on. Roblox is slow, this may take a while..")
        interaction.client.logger.debug(`ownsgamepass: ${ownsGamePass}`)

        if (ownsGamePass) {
            noblox.changeRank(parseInt(process.env.CMTZ_GROUP??"0"), robloxId, 1)
                .then(async _ => {
                    await interaction.editReply(`:thumbsup: Changed \`${robloxUsername}\`'s rank from Member to Member+.`);
                })
                .catch(async (err: Error) => {
                    await interaction.editReply(`Shit. That's not supposed to happen.\n\`\`\`${err.name}: ${err.message}\n\nDeveloper mumbo-jumbo:\n${err.stack}\`\`\``)
                    this.container.logger.error(err);
                })
        } else {
            return await interaction.reply(`:thumbsdown: I didn't find the Member+ asset ID in their inventory.`)
        }

        return null;
    }
}