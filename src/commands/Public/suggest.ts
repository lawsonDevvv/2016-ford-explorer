import {ApplyOptions} from "@sapphire/decorators";
import {ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior} from "@sapphire/framework";
import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    SlashCommandBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";

@ApplyOptions<CommandOptions>({
    description: "Make a suggestion.",
    cooldownDelay: 30000
})
export default class extends Command {
    public registerApplicationCommands(registry: ApplicationCommandRegistry) {
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
        ;

        registry.registerChatInputCommand(builder, {behaviorWhenNotIdentical: RegisterBehavior.VerboseOverwrite});
    }

    public async chatInputRun(interaction: ChatInputCommandInteraction) {
        const modal = new ModalBuilder()
            .setCustomId('suggestionModal')
            .setTitle('New Suggestion');

        const typeInput = new TextInputBuilder()
            .setCustomId('typeInput')
            .setLabel("What type of suggestion is this?")
            .setMaxLength(6)
            .setPlaceholder("Server/Game")
            .setStyle(TextInputStyle.Short)

        const suggestionInput = new TextInputBuilder()
            .setCustomId('suggestionInput')
            .setLabel("What\'s your suggestion?")
            .setMaxLength(191)
            .setStyle(TextInputStyle.Paragraph)

        const reasonInput = new TextInputBuilder()
            .setCustomId('reasonInput')
            .setMaxLength(191)
            .setLabel("Why should your suggestion be added?")
            .setStyle(TextInputStyle.Short)

        const actionRow1 = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(typeInput);
        const actionRow2 = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(suggestionInput);
        const actionRow3 = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(reasonInput);

        modal.addComponents(actionRow1, actionRow2, actionRow3);
        await interaction.showModal(modal);
    }
}