import {ApplyOptions} from "@sapphire/decorators";
import {ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior} from "@sapphire/framework";
import {ChatInputCommandInteraction, GuildMember, SlashCommandBuilder} from "discord.js";
import {blacklistRoles, blacklistType, CaseStatus, CaseTypeMetadata} from "../../util/types/Cases";
import createCase from "src/util/cases/createCase";
import editCase from "../../util/cases/editCase";
import {prisma} from "../../Bot";
import {Case} from "@prisma/client";

@ApplyOptions<CommandOptions>({
    description: "Unblacklist a user from a specific bot feature.",
    preconditions: ["Staff"]
})
export default class extends Command {
    public registerApplicationCommands(registry: ApplicationCommandRegistry) {
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption(
                o => o
                    .setName("user")
                    .setDescription("The user to unblacklist.")
                    .setRequired(true)
            )
            .addStringOption(
                o => o
                    .setName("type")
                    .setDescription("The type of blacklist to remove from the user.")
                    .addChoices([
                        {
                            name: "Counting Blacklist",
                            value: 'countingUnblacklist'
                        },
                        {
                            name: "Ticket Blacklist",
                            value: 'ticketBlacklist'
                        },
                        {
                            name: "Giveaway Blacklist",
                            value: 'giveawayBlacklist'
                        },
                        {
                            name: "Run Blacklist",
                            value: 'runBlacklist'
                        }
                    ])
                    .setRequired(true)
            )
            .addStringOption(
                o => o
                    .setName("reason")
                    .setDescription("The reason for unblacklisting the user.")
                    .setRequired(true)
            )
            .addBooleanOption(
                o => o
                    .setName("rescind")
                    .setDescription("Whether to rescind the original case. This will stop it from showing in case records and will have to be manually searched.")
                    .setRequired(true)
            );

        registry.registerChatInputCommand(builder, { behaviorWhenNotIdentical: RegisterBehavior.VerboseOverwrite });
    }

    public async chatInputRun(interaction: ChatInputCommandInteraction) {
        const user: GuildMember = interaction.options.getMember("user") as GuildMember; // If it's not a GuildMember then the world has already ended
        const type: blacklistType = interaction.options.getString("type", true) as blacklistType; // Really jank casting cause hurr durr typescript or something
        const reason: string = interaction.options.getString("reason", true);
        const rescind: boolean = interaction.options.getBoolean("rescind", true);
        let rescinded: boolean = false;

        if (!interaction.guild) return;

        await interaction.deferReply();

        if (!user.roles.cache.has(blacklistRoles[type])) return await interaction.editReply("I can't unblacklist someone who isn't blacklisted, genius.");

        await createCase(interaction.guild, user.user /* :shrug: */, interaction.user, CaseTypeMetadata[type], reason);

        if (rescind) {
            const recentActiveCase: Case | null = await prisma.case.findFirst({
                where: {
                    user: user.id,
                    status: {
                        not: CaseStatus.Rescinded
                    }
                },
                orderBy: {editedAt: "desc"}
            });

            if (!recentActiveCase) return await interaction.editReply({ content: `This user does not have any active cases to rescind.` })

            await editCase(recentActiveCase.id, { status: CaseStatus.Rescinded })
            rescinded = true;
        }

        await user.roles.remove(blacklistRoles[type]);

        return await interaction.editReply({ content: `Case Removed: :thumbsup:\nCase Rescinded: ${rescinded ? ':thumbsup:' : ':thumbsdown:'}` });
    }
}