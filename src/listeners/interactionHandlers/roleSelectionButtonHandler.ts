/**
 * I am completely cognitive of how horrible this code is.
 * No, I do not plan on rewriting this any time soon.
 * It works as is, and if I try to fix it, it will break.
 * If this file becomes a problem at some point, let me know.
 *
 * Yours truly,
 *     Lawson
 */

// TODO Rewrite this whole listener cause it's cancerous to society

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
                        flags: ['Ephemeral']
                    });
                }

                if (interaction.member instanceof GuildMember) {
                    if (!interaction.member.roles.cache.has(devPingsRole.id)) {
                        await interaction.member.roles.add(devPingsRole);
                        return await interaction.reply({
                            content: "Added Development Pings role.",
                            flags: ['Ephemeral']
                        })
                    } else {
                        await interaction.member.roles.remove(devPingsRole);
                        return await interaction.reply({
                            content: "Removed Development Pings role.",
                            flags: ['Ephemeral']
                        })
                    }
                } else {
                    return await interaction.reply({
                        content: "```Cylinder 1 Misfire: Internal Server Error (FourteenBleeckerBridge)```",
                        flags: ['Ephemeral']
                    })
                }
            case "announcementPingsButton":
                const announcementsPingRole = interaction.guild.roles.cache.get("1229076056451973151");

                if (!announcementsPingRole) {
                    return await interaction.reply({
                        content: "```Cylinder 1 Misfire: Internal Server Error (IronInSignal)```",
                        flags: ['Ephemeral']
                    });
                }

                if (interaction.member instanceof GuildMember) {
                    if (!interaction.member.roles.cache.has(announcementsPingRole.id)) {
                        await interaction.member.roles.add(announcementsPingRole);
                        return await interaction.reply({
                            content: "Added Announcement Pings role.",
                            flags: ['Ephemeral']
                        })
                    } else {
                        await interaction.member.roles.remove(announcementsPingRole);
                        return await interaction.reply({
                            content: "Removed Announcements Ping role.",
                            flags: ['Ephemeral']
                        })
                    }
                } else {
                    return await interaction.reply({
                        content: "```Cylinder 1 Misfire: Internal Server Error (FourteenBleeckerBridge)```",
                        flags: ['Ephemeral']
                    })
                }
            case "eventPingsButton":
                const eventPingsRole = interaction.guild.roles.cache.get("1272433812957298798");
                if (!eventPingsRole) {
                    return await interaction.reply({
                        content: "```Cylinder 1 Misfire: Internal Server Error (IronInSignal)```",
                        flags: ['Ephemeral']
                    });
                }

                if (interaction.member instanceof GuildMember) {
                    if (!interaction.member.roles.cache.has(eventPingsRole.id)) {
                        await interaction.member.roles.add(eventPingsRole);
                        return await interaction.reply({
                            content: "Added Event Pings role.",
                            flags: ['Ephemeral']
                        })
                    } else {
                        await interaction.member.roles.remove(eventPingsRole);
                        return await interaction.reply({
                            content: "Removed Event Pings role.",
                            flags: ['Ephemeral']
                        })
                    }
                } else {
                    return await interaction.reply({
                        content: "```Cylinder 1 Misfire: Internal Server Error (FourteenBleeckerBridge)```",
                        flags: ['Ephemeral']
                    })
                }
            case "wallOfShamePingsButton":
                const wallOfShamePingsRole = interaction.guild.roles.cache.get("1368686487331147848");
                if (!wallOfShamePingsRole) {
                    return await interaction.reply({
                        content: "```Cylinder 1 Misfire: Internal Server Error (IronInSignal)```",
                        flags: ['Ephemeral']
                    });
                }
                if (interaction.member instanceof GuildMember) {
                    if (!interaction.member.roles.cache.has(wallOfShamePingsRole.id)) {
                        await interaction.member.roles.add(wallOfShamePingsRole);
                        return await interaction.reply({
                            content: "Added Wall of Shames Pings role.",
                            flags: ['Ephemeral']
                        })
                    } else {
                        await interaction.member.roles.remove(wallOfShamePingsRole);
                        return await interaction.reply({
                            content: "Removed Wall of Shames Pings role.",
                            flags: ['Ephemeral']
                        })
                    }
                } else {
                    return await interaction.reply({
                        content: "```Cylinder 1 Misfire: Internal Server Error (FourteenBleeckerBridge)```",
                        flags: ['Ephemeral']
                    })
                }
            case "bullshitPingsButton":
                const bullshitPingsRole = interaction.guild.roles.cache.get("1368686522504712343");
                if (!bullshitPingsRole) {
                    return await interaction.reply({
                        content: "```Cylinder 1 Misfire: Internal Server Error (IronInSignal)```",
                        flags: ['Ephemeral']
                    });
                }
                if (interaction.member instanceof GuildMember) {
                    if (!interaction.member.roles.cache.has(bullshitPingsRole.id)) {
                        await interaction.member.roles.add(bullshitPingsRole);
                        return await interaction.reply({
                            content: "Added Bullshit Pings Role role.",
                            flags: ['Ephemeral']
                        })
                    } else {
                        await interaction.member.roles.remove(bullshitPingsRole);
                        return await interaction.reply({
                            content: "Removed Bullshit Pings Role role.",
                            flags: ['Ephemeral']
                        })
                    }
                } else {
                    return await interaction.reply({
                        content: "```Cylinder 1 Misfire: Internal Server Error (FourteenBleeckerBridge)```",
                        flags: ['Ephemeral']
                    })
                }
        }
        return;
    }
}