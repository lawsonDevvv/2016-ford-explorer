import {ApplicationCommandRegistry, Command, CommandOptions} from "@sapphire/framework";
import {
    ChatInputCommandInteraction,
    Message,
    MessageFlags,
    ModalBuilder,
    SlashCommandBuilder,
    TextInputStyle
} from "discord.js";
import {ActionRowBuilder, TextInputBuilder} from "@discordjs/builders";
import {prisma} from "../../../Bot";
import { BackupCode } from "@prisma/client";
import {ApplyOptions} from "@sapphire/decorators";
type authenticationMethod = "2fa" | "backup";

@ApplyOptions<CommandOptions>({
    description: "Disable 2-Factor Authentication",
    preconditions: ["HighRank", "Staff"]
})
export default class extends Command {
    public registerApplicationCommands(registry: ApplicationCommandRegistry): void {
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption(
                o => o
                    .setName("authmethod")
                    .setDescription("Authentication method")
                    .setChoices([
                        {
                            name: "2FA Authenticator Code",
                            value: "2fa"
                        },
                        {
                            name: "Backup Code",
                            value: "backup"
                        }
                    ])
                    .setRequired(true)
            );

        registry.registerChatInputCommand(builder);
    }

    public async chatInputRun(interaction: ChatInputCommandInteraction): Promise<Message | undefined> {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const backupCode: BackupCode | null = await prisma.backupCode.findUnique({
            where: {
                userId: interaction.user.id
            }
        });
        if (!backupCode) return interaction.editReply("2FA is not enabled for you.");

        const authenticationMethod = interaction.options.getString("authmethod", true) as authenticationMethod;

        /* Self-explanatory switch statement to handle different authentication methods */
        switch (authenticationMethod) {
            case "2fa":
                const twoFactorCodeInput = new TextInputBuilder()
                    .setCustomId("twoFactorCode")
                    .setLabel("2FA Authenticator Code")
                    .setStyle(TextInputStyle.Short)
                    .setMinLength(6)
                    .setMaxLength(6)
                    .setPlaceholder("ex: abc123def456")
                    .setRequired(true);

                const twoFactorCodeActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(twoFactorCodeInput);
                const twoFactorCodeModal = new ModalBuilder()
                    .setCustomId("twoFactorCodeModalModal")
                    .setTitle("2FA Rescue")
                    .addComponents(twoFactorCodeActionRow);

                await interaction.showModal(twoFactorCodeModal);
                return;

            case "backup":
                const backupCodeInput = new TextInputBuilder()
                    .setCustomId("backupCode")
                    .setLabel("Backup Code")
                    .setStyle(TextInputStyle.Short)
                    .setMinLength(12)
                    .setMaxLength(12)
                    .setPlaceholder("ex: 123456")
                    .setRequired(true);

                const backupCodeActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(backupCodeInput);
                const backupCodeModal = new ModalBuilder()
                    .setCustomId("backupCodeModal")
                    .setTitle("2FA Rescue")
                    .addComponents(backupCodeActionRow);

                await interaction.showModal(backupCodeModal);
                return;

            default:
                return;
        }
    }
}