import {ApplicationCommandRegistry, Command, CommandOptions} from "@sapphire/framework";
import {ApplyOptions} from "@sapphire/decorators";
import {
    ChatInputCommandInteraction,
    Colors,
    SlashCommandBuilder,
    ThreadOnlyChannel
} from "discord.js";
import {client, prisma} from "../../../Bot";
import {EmbedBuilder} from "@discordjs/builders";

@ApplyOptions<CommandOptions>({
    description: "Accept a suggestion.",
    preconditions: ["Staff"]
})
export default class extends Command {
    public registerApplicationCommands(registry:ApplicationCommandRegistry): void {
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption(o =>
                o
                    .setName("id")
                    .setDescription("Suggestion ID")
                    .setRequired(true)
            )
            .addStringOption(o =>
                o
                    .setName("note")
                    .setDescription("The staff note to include in the embed.")
                    .setRequired(true)
            );

        registry.registerChatInputCommand(builder);
    }

    public async chatInputRun(interaction: ChatInputCommandInteraction) {
        const id: string = interaction.options.getString("id", true);
        const note: string = interaction.options.getString("note", true);
        if (!interaction.guild) return;

        const suggestion = await prisma.suggestion.findUnique({
            where: { id },
            select: {
                id: true,
                type: true,
                suggestion: true,
                reason: true,
                author: true,
                createdAt: true,
                messageId: true,
            }
        }).catch(async (error: any): Promise<undefined> => {
            if (error.code === "P2025") {
                await interaction.reply("Cylinder 6 Misfire ```404 Suggestion not found.```");
                return undefined;
            } else throw error;
        });

        if (!suggestion) return await interaction.reply(`Cylinder 6 Misfire \`\`\`Error fetching suggestion #${id}\`\`\``);

        const updatedSuggestion = await prisma.suggestion.update({
            where: { id },
            data: {
                status: "Accepted",
                staffResponse: note,
                editedBy: interaction.user.id
            },
            select: {
                id: true,
                type: true
            }
        }).catch(async (error: any) => {
            this.container.logger.error(error);
            await interaction.reply("Cylinder 6 Misfire \`\`\`An unknown error occurred. Contact the developer.\n\nError Code: 42ConnectorProject\`\`\`")
            return undefined;
        });

        if (!updatedSuggestion) {
            return await interaction.reply("Cylinder 1 Misfire \`\`\`Error Code: NovemberFiveFoxtrot\`\`\`");
        }

        const embed = new EmbedBuilder()
            .setTitle("New Suggestion")
            .addFields([
                {
                    name: "Submitter",
                    value: `<@${suggestion.author}>`,
                    inline: false
                },
                {
                    name: "Type",
                    value: updatedSuggestion.type || suggestion.type || "This suggestion is supposed to have a type but I can't see what it is.",
                    inline: false
                },
                {
                    name: "Suggestion",
                    value: suggestion.suggestion,
                    inline: false
                },
                {
                    name: "Why should your suggestion be added? How will this benefit the group?",
                    value: suggestion.reason,
                    inline: true
                },
                {
                    name: `:white_check_mark: Your suggestion was accepted by ${interaction.user.username}`,
                    value: `\`${note}\``,
                    inline: false
                }
            ])
            .setFooter({text: `#${suggestion.id}`})
            .setTimestamp(suggestion.createdAt)
            .setColor(Colors.Green);

        const channel = interaction.guild.channels.cache.get('1286445249287163914') as ThreadOnlyChannel;
        const thread = await channel.threads.fetch(suggestion.messageId);
        if (!thread) return await interaction.reply("I couldn't find a thread for that suggestion. Did it get deleted?");
        const message  = await thread.fetchStarterMessage();
        if (!message) return await interaction.reply("That suggestion's thread does not have a starter message. Was it deleted?");

        await thread.send(`This suggestion was **accepted** by ${interaction.user.username}.`)
        await message.edit({embeds: [embed]})
            .catch(async (error: any) => {
                this.container.logger.error(error);
                await message.reply("An error occurred while editing the suggestion message. Please contact the developer.")
            });

        const author = await client.users.fetch(suggestion.author);
        await author.send(`Your [suggestion](${message.url}) (${suggestion.id}) was **accepted**.`)

        return await interaction.reply(":white_check_mark:")

    }
}