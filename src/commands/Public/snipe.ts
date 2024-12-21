import { ApplyOptions } from "@sapphire/decorators";
import { CommandOptions, Command, ApplicationCommandRegistry, RegisterBehavior } from "@sapphire/framework";
import { ChatInputCommandInteraction, InteractionResponse, TextChannel } from "discord.js";
import { EmbedBuilder, SlashCommandBuilder } from "@discordjs/builders";
import { editSnipes, snipes } from "../../Bot.js";

@ApplyOptions<CommandOptions>({
    description: "Snipe a deleted message.",
    cooldownDelay: 5000,
})
export default class extends Command {
    public registerApplicationCommands(registry: ApplicationCommandRegistry) {
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption(option => 
                option
                    .setName("type")
                    .setDescription("Choose whether to snipe a message or an edit.")
                    .addChoices(
                        {
                            name: "Message Snipe",
                            value: "msg"
                        },
                        {
                            name: "Edit Snipe",
                            value: "edit"
                        }
                    )
                    .setRequired(true)
            )

        registry.registerChatInputCommand(builder, {behaviorWhenNotIdentical: RegisterBehavior.Overwrite});
    }

    public async chatInputRun(interaction: ChatInputCommandInteraction): Promise<InteractionResponse<boolean> | null> {
        const type = interaction.options.getString("type", true);

        switch (type) {
            case "msg":
                const snipe = snipes.get((interaction.channel as TextChannel).id);
                if (!snipe) return interaction.reply("There's nothing to snipe. This message was probably sent before/during a restart.");

                const snipeEmbed = new EmbedBuilder()
                    .setTitle("Gotcha.")
                    .setAuthor({ name: snipe.author.tag, iconURL: snipe.author.displayAvatarURL() })
                    .setDescription(snipe.content)
                    .setFooter({ text: "v6Supercharged Studios™️" })
                ;

                return await interaction.reply({ embeds: [snipeEmbed] });
            case "edit":
                const editSnipe = editSnipes.get((interaction.channel as TextChannel).id);
                if (!editSnipe) return interaction.reply("There's nothing to snipe. This message was probably edited before/during a restart.");

                const editSnipeEmbed = new EmbedBuilder()
                    .setTitle("Gotcha.")
                    .setAuthor({ name: editSnipe[0].author.tag, iconURL: editSnipe[0].author.displayAvatarURL() })
                    .setDescription(editSnipe[1].content)
                    .setFooter({ text: "v6Supercharged Studios™️" })
                ;

                return interaction.reply({embeds: [editSnipeEmbed]});
        }

        return null;
    }
}