import {ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior} from "@sapphire/framework";
import {ApplyOptions} from "@sapphire/decorators";
import {
    Awaitable,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    TextChannel
} from "discord.js";
import {EmbedBuilder} from "@discordjs/builders";
import {prisma} from "../../Bot";
import ShortUniqueId from "short-unique-id";
const { randomUUID } = new ShortUniqueId({ length: 10 });

@ApplyOptions<CommandOptions>({
    description: "Send a suggestion to the developers for it to be voted on! Get lucky and you may have your suggestion added."
})
export default class extends Command {
    registerApplicationCommands(registry: ApplicationCommandRegistry): Awaitable<void> {
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.name)
            .addStringOption(o =>
                o
                    .setName("suggestion")
                    .setDescription("What's your suggestion?")
                    .setMaxLength(191)
                    .setMinLength(2)
                    .setRequired(true)
            )
            .addStringOption(o =>
                o
                    .setName("reason")
                    .setDescription("How will this suggestion benefit the game/player experience?")
                    .setMaxLength(191)
                    .setMinLength(2)
                    .setRequired(true)
            );
        registry.registerChatInputCommand(builder, {behaviorWhenNotIdentical: RegisterBehavior.Overwrite});
    }

    public async chatInputRun(interaction: ChatInputCommandInteraction) {
        const suggestion = interaction.options.getString("suggestion", true);
        const reason = interaction.options.getString("reason", true);
        await interaction.reply("Hold on.")

        const createdSuggestion = await prisma.suggestion.create({
            data: {
                id: randomUUID(6),
                author: interaction.user.id,
                suggestion,
                reason,
            }
        });

        const embed = new EmbedBuilder()
            .setTitle("New Suggestion")
            .addFields([
                {
                    name: "Submitter",
                    value: interaction.user.username,
                    inline: false
                },
                {
                    name: "Suggestion",
                    value: suggestion,
                    inline: false
                },
                {
                    name: "How will this benefit the game?",
                    value: reason,
                    inline: true
                }
            ])
            .setFooter({text: `Suggestion ID: ${createdSuggestion.id}`})
        ;

        await (interaction.guild?.channels.cache.get('1242988692419772467') as TextChannel).send({embeds: [embed]});
        await interaction.editReply("Done. Suggestion ID " + createdSuggestion.id);
    }
}