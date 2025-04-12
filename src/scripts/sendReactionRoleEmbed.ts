import {ActionRowBuilder, ButtonStyle, MessageActionRowComponentBuilder, TextChannel} from "discord.js";
import {ButtonBuilder, EmbedBuilder} from "@discordjs/builders";

const sendReactionRoleEmbed = (channel: TextChannel) => {
    const embed = new EmbedBuilder()
        .setTitle("Role Selection")
        .setDescription("To receive a role, select it here. If you would like to have the role removed, select the button again.")

    const devPingsButton = new ButtonBuilder()
        .setLabel("Development Pings")
        .setEmoji({name: "💻"})
        .setStyle(ButtonStyle.Primary)
        .setCustomId("devPingsButton");

    const announcementPingsButton = new ButtonBuilder()
        .setLabel("Announcement Pings")
        .setEmoji({name: "📣"})
        .setStyle(ButtonStyle.Primary)
        .setCustomId("announcementPingsButton");

    const runPingsButton = new ButtonBuilder()
        .setLabel("Event Pings")
        .setEmoji({name: '🚆'})
        .setStyle(ButtonStyle.Primary)
        .setCustomId("eventPingsButton");

    const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(devPingsButton, announcementPingsButton, runPingsButton);

    channel.send({
        embeds: [embed],
        components: [actionRow]
    }).catch((err: any) => {
        throw err;
    })
}

export default sendReactionRoleEmbed;