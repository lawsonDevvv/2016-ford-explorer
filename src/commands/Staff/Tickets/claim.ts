import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from "@sapphire/framework";
import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder, TextChannel } from "discord.js";
import { prisma } from "src/Bot";

@ApplyOptions<CommandOptions>({
    description: "Claim a ticket.",
    preconditions: ["Staff", "GuildOnly"]

})
export default class extends Command {
    public registerApplicationCommands(registry: ApplicationCommandRegistry) {
        const builder = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        
        registry.registerChatInputCommand(builder, {
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite
        });
    }

    public async chatInputRun(interaction: ChatInputCommandInteraction) {
        if (!(interaction.channel instanceof TextChannel)) return await interaction.reply("This channel is not a text channel nor a ticket, please do this command in a ticket.");

        const ticket = await prisma.ticket.findFirst({
            where: {
                channel: interaction.channel.id
            }
        });

        if (!ticket) return await interaction.reply({
            content: "This channel is not a ticket, run this command in a ticket.",
            flags: [
                MessageFlags.Ephemeral
            ]
        });

        await interaction.channel.edit({
            name: `claimed-${ticket.number}`
        });

        return await interaction.reply({
            content: ':thumbsup:'
        });
    }
        
}