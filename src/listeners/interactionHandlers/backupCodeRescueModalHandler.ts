import {ApplyOptions} from "@sapphire/decorators";
import {Events, Listener, ListenerOptions} from "@sapphire/framework";
import {InteractionResponse, ModalSubmitInteraction} from "discord.js";
import {deleteBackupCode, getBackupCode} from "../../util/2FA";
import {BackupCode} from "@prisma/client";
import bcrypt from "bcryptjs";

@ApplyOptions<ListenerOptions>({
    event: Events.InteractionCreate
})
export default class extends Listener {
    public async run(interaction: ModalSubmitInteraction): Promise<InteractionResponse | void> {
        if (!interaction.isModalSubmit()) return;
        if (interaction.customId !== "backupCodeModal") return;

        const backupCodeInput: string = interaction.fields.getTextInputValue("backupCode");

        const backupCode: BackupCode | null = await getBackupCode(interaction.user);
        if (!backupCode) return await interaction.reply("You don't even have 2FA enabled.");

        if (!await bcrypt.compare(backupCodeInput, backupCode.code)) return await interaction.reply("Incorrect backup code.");

        await deleteBackupCode(interaction.user);

        return await interaction.reply("2FA disabled. Next time don't lose your credentials? To re-enable 2FA, run /enable2fa.");
    }
}