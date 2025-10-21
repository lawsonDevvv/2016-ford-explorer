import {Events, Listener, ListenerOptions} from "@sapphire/framework";
import {ApplyOptions} from "@sapphire/decorators";
import {
    ForumChannel,
    InteractionResponse, Message,
    ModalSubmitInteraction,
    Snowflake,
    ThreadAutoArchiveDuration
} from "discord.js";
import {EmbedBuilder} from "@discordjs/builders";
import {prisma} from "../../Bot";
import ShortUniqueId from "short-unique-id";
import SuggestionThreadTags from "../../util/types/suggestionThreadTags";
const { randomUUID } = new ShortUniqueId({ length: 10 });
@ApplyOptions<ListenerOptions>({
    event: Events.InteractionCreate
})
export default class extends Listener {
    public async run(interaction: ModalSubmitInteraction): Promise<Promise<void> | InteractionResponse<boolean>> {
        if (!interaction.isModalSubmit()) return;
        if (interaction.customId !== "suggestionModal") return;

        const type = interaction.fields.getTextInputValue('typeInput');
        const suggestion = interaction.fields.getTextInputValue('suggestionInput');
        const reason = interaction.fields.getTextInputValue('reasonInput');

        let appliedTags: Array<Snowflake> = []
        switch (type.toLowerCase()) {
            case "server":
                appliedTags.push(SuggestionThreadTags.ServerSuggestion.id)
                break;
            case "game":
                appliedTags.push(SuggestionThreadTags.GameSuggestion.id)
                break;
            case "other":
                appliedTags.push(SuggestionThreadTags.OtherSuggestion.id)
                break;
            default:
                return await interaction.reply("You did not submit one of the accepted Suggestion Types: Server, Game, or Other. Please try again.")
        }

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
                    name: "Type",
                    value: type,
                    inline: false
                },
                {
                    name: "Suggestion",
                    value: suggestion,
                    inline: false
                },
                {
                    name: "Why should your suggestion be added? How will this benefit the group?",
                    value: reason,
                    inline: true
                }
            ])
            .setFooter({text: `Suggestion ID: ${createdSuggestion.id}`})
        ;
        const suggestionThread = await (interaction.guild?.channels.cache.get('1286445249287163914') as ForumChannel).threads.create({
            name: `${type} Suggestion from ${interaction.user}`,
            autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
            message: {
                embeds: [embed]
            },
            appliedTags
        });
        const suggestionMessage = await suggestionThread.fetchStarterMessage() as Message;
        await suggestionMessage.react('✅');
        await suggestionMessage.react('❌');
        await suggestionMessage.reply("A thread was created to discuss this suggestion. You may vote using the reactions I've provided above.");
        await prisma.suggestion.update({
            where: {
                id: createdSuggestion.id
            },
            data: {
                messageId: suggestionMessage.id
            }
        }).then(async s => {
            await interaction.reply(`Done. Suggestion ID ${s.id}`);
        }).catch(async _ => {
            await interaction.reply(`Cylinder 1 misfire.\n\`\`\`Database update error. This is NOT supposed to happen.\`\`\`\n<@415278805683404821> come save me :(`);
        });
    }
}