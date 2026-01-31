import {ApplyOptions} from "@sapphire/decorators";
import {ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior} from "@sapphire/framework";
import {
    AttachmentBuilder,
    ChatInputCommandInteraction,
    Message,
    MessageFlags,
    SlashCommandBuilder,
    User
} from "discord.js";
import bcrypt from "bcryptjs";
import {
    deriveSecretFromUser,
    generateBackupKey,
    generateOTPAuthURI,
    generateQRCode,
    getBackupCode
} from "../../../util/2FA";
import { prisma } from "../../../Bot";
import { BackupCode } from "@prisma/client";

@ApplyOptions<CommandOptions>({
    description: "Enable 2-Factor Authentication for group payouts.",
    preconditions: ["HighRank", "Staff"]
})
export default class extends Command {
    private saltRounds: number = 10;

    public registerApplicationCommands(registry: ApplicationCommandRegistry) {
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description);

        registry.registerChatInputCommand(builder, {
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite
        });
    }

    public async chatInputRun(interaction: ChatInputCommandInteraction): Promise<Message> {
        await interaction.deferReply({ flags: [ MessageFlags.Ephemeral ] });

        const existingBackupCode: BackupCode | null = await getBackupCode(interaction.user);
        if (existingBackupCode) {
            return await interaction.editReply(
                `You already have 2FA enabled.\n` +
                `If you lost access to your authenticator app, you can use your 2FA backup code that was generated when you enabled 2FA. If you do not have this backup code, contact the developer.`
            );
        }

        // 2FA Secret
        const secret: string = deriveSecretFromUser(interaction.user.id);
        
        const backupCode: string = generateBackupKey();
        await this.saveBackupCode(interaction.user, backupCode)

        const qrCode: Buffer = await generateQRCode(generateOTPAuthURI(secret, interaction.user.username))
        const attachmentBuilder = new AttachmentBuilder(qrCode)
            .setName("qrCode.png");

        return interaction.editReply({
            content:
                `Token: ${secret}\n` +
                `Backup: ${backupCode} (SAVE YOUR BACKUP CODE SOMEWHERE SAFE!!!!!)\n\n` +
                `Scan the QR code below with your favorite authenticator app (Authy, Google Authenticator, etc).\n` +
                `If you are unable to scan the QR code above, you can input your token (at the top of this message) manually into your 2FA application of choice.\n` +
                `For help with this, ask Google. I am not an encyclopedia :pray:`,
            files: [attachmentBuilder]
        });
    }

    /**
     * Hash and save a user's backup code to the database.
     * @param user User
     * @param key Backup code (NON-HASHED!!!)
     * @returns {Promise<BackupCode>}
     * @
     */
    protected async saveBackupCode(user: User, key: string): Promise<BackupCode> {
        return prisma.backupCode.create({
            data: {
                userId: user.id,
                code: await bcrypt.hash(key, this.saltRounds)
            }
        });
    }


}