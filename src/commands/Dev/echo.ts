import {ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior} from "@sapphire/framework";
import {ApplyOptions} from "@sapphire/decorators";
import {ChatInputCommandInteraction, SlashCommandBuilder, TextChannel} from "discord.js";

@ApplyOptions<CommandOptions>({
    description: "BIE_DEADMAN",
    preconditions: ["OwnerOnly"]
})
export default class extends Command {
    public registerApplicationCommands(registry: ApplicationCommandRegistry) {
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption(o =>
                o
                    .setName("text")
                    .setDescription("LOSS_OF_TRAIN_OPERATOR_INDICATION")
                    .setRequired(true)
            )
            .addChannelOption(o =>
                o
                    .setName("channel")
                    .setDescription("DEAD_MOTOR")
                    .setRequired(false)
            );

        registry.registerChatInputCommand(builder, { behaviorWhenNotIdentical: RegisterBehavior.Overwrite});
    }

    public async chatInputRun(interaction: ChatInputCommandInteraction) {
        let text: string = interaction.options.getString("text", true)
        const channel = interaction.options.getChannel("channel") ?? interaction.channel;

        if (!(channel instanceof TextChannel)) return await interaction.reply("das not a text channel bro :skull:")
        try {
            await channel.send({ content: text })
        } catch (e: any) {
            this.container.logger.error(e);
            return await interaction.reply({ content: `${e}`, flags: ['Ephemeral'] })
        }

        return await interaction.reply({ content: `On the clear as-as-aspect behind 632, [Signal's In Plastic](${channel.url}).`, flags: ['Ephemeral'] })
    }
}