import {ApplyOptions} from "@sapphire/decorators";
import {ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior} from "@sapphire/framework";
import {TextChannel, ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder} from "discord.js";
import {prisma} from "../../../Bot";

@ApplyOptions<CommandOptions>({
    description: "Renames a ticket.",
    preconditions: ["Staff", "GuildOnly"]
})
export default class extends Command {
    public registerApplicationCommands(registry: ApplicationCommandRegistry): void {
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption(o =>
                o
                    .setName('name')
                    .setDescription('New channel name.')
            );

        registry.registerChatInputCommand(builder, {
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite
        });
    }

    public async chatInputRun(interaction: ChatInputCommandInteraction) {
        const name: string = interaction.options.getString('name', true);

        if (!(interaction.channel instanceof TextChannel)) return await interaction.reply("This channel is not a text channel nor is it a ticket.");

        const ticket = await prisma.ticket.findFirst({
            where: {
                channel: interaction.channel!.id
            }
        });

        if (!ticket) return await interaction.reply({
            content: "This channel is not a ticket.",
            flags: [
                MessageFlags.Ephemeral
            ]
        });

        await interaction.channel.edit({
            name: `${name}-${ticket.number}`
        });

        return await interaction.reply({
            content: ':thumbsup:'
        });
    }
}