/**
 * I am completely cognitive of how horrible this code is.
 * No, I do not plan on rewriting this any time soon.
 * It works as is, and if I try to fix it, it will break.
 * If this file becomes a problem at some point, let me know.
 *
 * Yours truly,
 *     Lawson
 */

import {Events, Listener, ListenerOptions} from "@sapphire/framework";
import {ApplyOptions} from "@sapphire/decorators";
import {ButtonInteraction, GuildMemberRoleManager, MessageFlags, Role} from "discord.js";
import {isRoleSelectionOption} from "../../util/typeguards/isRoleSelectionOption";
import {roleSelectionOption, roleSelectionRoleIDs} from "../../util/types/RoleSelection";

@ApplyOptions<ListenerOptions>({
    event: Events.InteractionCreate
})
export default class extends Listener {
    public async run(interaction: ButtonInteraction, customId: string = interaction.customId) {
        if (!interaction.isButton()) return;
        if (!interaction.guild || !interaction.member) return;
        if (!isRoleSelectionOption(customId)) return;
        if (!(interaction.member.roles instanceof GuildMemberRoleManager)) return;

        await interaction.deferReply({
            flags: [MessageFlags.Ephemeral]
        });

        const role: Role | null = await interaction.guild.roles.fetch(roleSelectionRoleIDs[customId as roleSelectionOption]);
        if (!role) return await interaction.editReply(`Cylinder 4 Misfire \`\`\`Role ${roleSelectionRoleIDs[customId as roleSelectionOption]} does not exist (Error Code: LowHome509)\`\`\``);
        if (interaction.member.roles.cache.has(role.id)) {
            await interaction.member.roles.remove(role);
            return await interaction.editReply(`Removed ${role}.`);
        } else {
            await interaction.member.roles.add(role);
            return await interaction.editReply(`Assigned ${role}`);
        }
    }
}