import {ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior} from "@sapphire/framework";
import {ChatInputCommandInteraction, Colors, EmbedBuilder, GuildMember, SlashCommandBuilder} from "discord.js";
import createCase from "../../util/cases/createCase";
import {CaseTypeMetadata, blacklistType, blacklistRoles} from "../../util/types/Cases";
import {ApplyOptions} from "@sapphire/decorators";

@ApplyOptions<CommandOptions>({
    description: 'Blacklist a user from a specific bot feature.',
    preconditions: ["Staff"]
})
export default class extends Command {
    public registerApplicationCommands(registry: ApplicationCommandRegistry): void {
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption(
                o => o
                    .setName('type')
                    .setDescription('The type of blacklist to issue.')
                    .setChoices([
                        {
                            name: 'Counting Blacklist',
                            value: 'counting'
                        },
                        {
                            name: 'Ticket Blacklist',
                            value: 'ticket'
                        },
                        {
                            name: 'Giveaway Blacklist',
                            value: 'giveaway'
                        },
                        {
                            name: 'Run Blacklist',
                            value: 'run'
                        }
                    ])
                    .setRequired(true)
            )
            .addUserOption(
                o => o
                    .setName('target')
                    .setDescription('Missile locked. New target: 208-33 44th Road.')
                    .setRequired(true)
            )
            .addStringOption(
                o => o
                    .setName('reason')
                    .setDescription('What the fuck is your operating motor?!?!?!')
                    .setRequired(true)
            );

        registry.registerChatInputCommand(builder, {behaviorWhenNotIdentical: RegisterBehavior.VerboseOverwrite});
    }

    public async chatInputRun(interaction: ChatInputCommandInteraction) {
        const type = interaction.options.getString('type', true) as blacklistType;
        const target = interaction.options.getMember('target') as GuildMember;
        const reason = interaction.options.getString('reason', true);

        if (!interaction.guild) return;
        await interaction.deferReply();

        if (target.roles.cache.has(blacklistRoles[type])) return await interaction.editReply(`I can't blacklist this user twice, idiot.`);

        await createCase(interaction.guild, interaction.user, target.user, CaseTypeMetadata[type], reason);
        await target.roles.add(blacklistRoles[type]);

        const embed = new EmbedBuilder()
            .setDescription(`Assigned <@&${blacklistRoles[type]}> to ${target}.`)
            .setColor(Colors.Red);

        return await interaction.editReply({
            content: `${target} Get beamed by merch.`,
            embeds: [embed]
        });
    }
}