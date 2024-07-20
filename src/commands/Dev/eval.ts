import { ApplyOptions } from "@sapphire/decorators";
import { CommandOptions, Command, ApplicationCommandRegistry, RegisterBehavior } from "@sapphire/framework";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";


@ApplyOptions<CommandOptions>({
    preconditions: ["OwnerOnly"],
    description: "Evaluate code."
})
export default class EvalCommand extends Command {
    registerApplicationCommands(registry: ApplicationCommandRegistry) {
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption(option =>
                option
                    .setName("code")
                    .setDescription("The code to evaluate.")
                    .setRequired(true)
            );

      registry.registerChatInputCommand(builder, {
          behaviorWhenNotIdentical: RegisterBehavior.Overwrite
      });
    }

    async chatInputRun(interaction: ChatInputCommandInteraction) {
        this.container.logger.info(`[EVAL] ${interaction.user.tag} (${interaction.user.id}) ran eval command.`);

        const code = interaction.options.getString("code", true);
        
        try {
            const evaled = eval(code);
            
            return await interaction.reply({ content: `${evaled}` });
        } catch (error) {
            return await interaction.reply({ content: `**Error: ${error}**`});
        }
    }
}