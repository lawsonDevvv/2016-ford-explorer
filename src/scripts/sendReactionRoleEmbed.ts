import {ActionRowBuilder, ButtonStyle, MessageActionRowComponentBuilder, TextChannel} from "discord.js";
import {ButtonBuilder, EmbedBuilder} from "@discordjs/builders";

const sendReactionRoleEmbed = async (channel: TextChannel) => {
    const embed = new EmbedBuilder()
        .setTitle("Role Selection")
        .setDescription("To receive a role, select it here. If you would like to have the role removed, select the button again.")

    const devPingsButton = new ButtonBuilder()
        .setLabel("Development Pings")
        .setEmoji({name: "💻"})
        .setStyle(ButtonStyle.Primary)
        .setCustomId("developmentPingsButton");

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

    const trainingPings = new ButtonBuilder()
        .setLabel("Training Pings")
        .setEmoji({name: '👷'})
        .setStyle(ButtonStyle.Primary)
        .setCustomId("trainingPingsButton");

    const wallOfShamePingsButton = new ButtonBuilder()
        .setLabel("Wall of Shame Pings")
        .setEmoji({name: '🤡'})
        .setStyle(ButtonStyle.Primary)
        .setCustomId("wallOfShamePingsButton");

    const bullshitPingsButton = new ButtonBuilder()
        .setLabel("Bullshit Pings")
        .setEmoji({name: '💩'})
        .setStyle(ButtonStyle.Primary)
        .setCustomId("bullshitPingsButton");

    const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(devPingsButton, announcementPingsButton, runPingsButton);
    const actionRow2 = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(trainingPings, wallOfShamePingsButton, bullshitPingsButton)

    await channel.send({
        embeds: [embed],
        components: [actionRow, actionRow2]
    }).catch((err: any) => {
        throw err;
    })
}

export default sendReactionRoleEmbed;