import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, Command, RegisterBehavior, type CommandOptions } from "@sapphire/framework";
import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, SlashCommandBuilder } from "discord.js";

@ApplyOptions<CommandOptions>({
    name: "userinfo",
    description: "View information about a specific user or yourself.",
    preconditions: ["GuildOnly"]
})
export default class extends Command {
    registerApplicationCommands(registry: ApplicationCommandRegistry) {
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption(option => 
                option
                    .setName("user")
                    .setDescription("The user to get information about.")
            );

        registry.registerChatInputCommand(builder, {
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite
        });
    }

    async chatInputRun(interaction: ChatInputCommandInteraction) {
        const member = interaction.member as GuildMember;

        const embed = new EmbedBuilder()
            .setTitle(`${member.user.tag}`)
            .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL()})
            .setThumbnail(member.displayAvatarURL())
            .setDescription(`**ID:** ${member.user.id}`)
            .addFields(
                {
                    name: "Created At",
                    value: member.user.createdAt.toUTCString() + " UTC",
                    inline: true
                },
                {
                    name: "Joined At",
                    value: member.joinedAt?.toUTCString() + " UTC",
                    inline: true
                },
                {
                    name: "Bot",
                    value: member.user.bot ? "Yes" : "No",
                    inline: true
                },
                {
                    name: "Role Count",
                    value: `${member.roles.cache.size}`,
                    inline: true
                },
            )
            .setFooter({ text: `Requested by ${interaction.user}. | Arrive Alive.` });

        interaction.reply({ embeds: [embed] });
    }
}