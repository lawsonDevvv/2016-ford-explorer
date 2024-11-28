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
import {ButtonInteraction, GuildMember} from "discord.js";

@ApplyOptions<ListenerOptions>({
    event: Events.InteractionCreate
})
export default class extends Listener {
    public async run(interaction: ButtonInteraction) {
        if (!interaction.isButton()) return;
        if (!interaction.guild || !interaction.member) return;

        switch (interaction.customId) {
            case "devPingsButton":
                const devPingsRole = interaction.guild.roles.cache.get("1254488188236599306");
                if (!devPingsRole) {
                    return await interaction.reply({
                        content: "```Cylinder 1 Misfire: Internal Server Error (IronInSignal)```",
                        ephemeral: true
                    });
                }
                if (interaction.member instanceof GuildMember) {
                    if (!interaction.member.roles.cache.has('1254488188236599306')) {
                        await interaction.member.roles.add(devPingsRole);
                        return await interaction.reply({
                            content: "Added Development Pings role.",
                            ephemeral: true
                        })
                    } else {
                        await interaction.member.roles.remove(devPingsRole);
                        return await interaction.reply({
                            content: "Removed Development Pings role.",
                            ephemeral: true
                        })
                    }
                } else {
                    return await interaction.reply({
                        content: "```Cylinder 1 Misfire: Internal Server Error (FourteenBleeckerBridge)```",
                        ephemeral: true
                    })
                }
            case "announcementPingsButton":
                const announcementsPingRole = interaction.guild.roles.cache.get("1229076056451973151");
                if (!announcementsPingRole) {
                    return await interaction.reply({
                        content: "```Cylinder 1 Misfire: Internal Server Error (IronInSignal)```",
                        ephemeral: true
                    });
                }
                if (interaction.member instanceof GuildMember) {
                    if (!interaction.member.roles.cache.has('1229076056451973151')) {
                        await interaction.member.roles.add(announcementsPingRole);
                        return await interaction.reply({
                            content: "Added Announcement Pings role.",
                            ephemeral: true
                        })
                    } else {
                        await interaction.member.roles.remove(announcementsPingRole);
                        return await interaction.reply({
                            content: "Removed Announcements Ping role.",
                            ephemeral: true
                        })
                    }
                } else {
                    return await interaction.reply({
                        content: "```Cylinder 1 Misfire: Internal Server Error (FourteenBleeckerBridge)```",
                        ephemeral: true
                    })
                }
            case "eventPingsButton":
                const eventPingsRole = interaction.guild.roles.cache.get("1272433812957298798");
                if (!eventPingsRole) {
                    return await interaction.reply({
                        content: "```Cylinder 1 Misfire: Internal Server Error (IronInSignal)```",
                        ephemeral: true
                    });
                }
                if (interaction.member instanceof GuildMember) {
                    if (!interaction.member.roles.cache.has('1272433812957298798')) {
                        await interaction.member.roles.add(eventPingsRole);
                        return await interaction.reply({
                            content: "Added Event Pings role.",
                            ephemeral: true
                        })
                    } else {
                        await interaction.member.roles.remove(eventPingsRole);
                        return await interaction.reply({
                            content: "Removed Event Pings role.",
                            ephemeral: true
                        })
                    }
                } else {
                    return await interaction.reply({
                        content: "```Cylinder 1 Misfire: Internal Server Error (FourteenBleeckerBridge)```",
                        ephemeral: true
                    })
                }
            default:
                return await interaction.reply({
                    content: "```Cylinder 1 Misfire: Internal Server Error (CBTCFailure)```",
                    ephemeral: true
                })
        }
    }
}