import {Events, Listener, ListenerOptions} from "@sapphire/framework";
import {ApplyOptions} from "@sapphire/decorators";
import {ModalSubmitInteraction, TextChannel} from "discord.js";
import {EmbedBuilder} from "@discordjs/builders";
import {prisma} from "../../Bot";
import ShortUniqueId from "short-unique-id";
const { randomUUID } = new ShortUniqueId({ length: 10 });
@ApplyOptions<ListenerOptions>({
    event: Events.InteractionCreate
})
export default class extends Listener {
    public async run(interaction: ModalSubmitInteraction): Promise<void> {
        if (!interaction.isModalSubmit()) return;
        if (interaction.customId !== "suggestionModal") return;

        const type = interaction.fields.getTextInputValue('typeInput');
        const suggestion = interaction.fields.getTextInputValue('suggestionInput');
        const reason = interaction.fields.getTextInputValue('reasonInput');

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

        const suggestionMessage = await (interaction.guild?.channels.cache.get('1242988692419772467') as TextChannel).send({embeds: [embed]});
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
            await interaction.reply(`Cylinder 1 misfire.\n\`\`\`This is NOT supposed to happen.\`\`\`\n<@415278805683404821> come save me :(`);
        })
    }
}