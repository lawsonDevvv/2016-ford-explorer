import { ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder, TextChannel } from "discord.js";

export const sendTicketEmbed = async (channel: TextChannel) => {
    const embed = new EmbedBuilder()
        .setTitle("Ticket Panel")
        .setDescription("**Select a ticket category below to be connected with our staff team.**")
        .setColor("Blue")
        .setFooter({ text: "lawson.nyc - \"If it ain't broke, don't fix it.\"" });

    const dropdown = new StringSelectMenuBuilder()
        .setCustomId('createTicketButton')
        .setPlaceholder('Select a ticket category')
        .addOptions([
            {
                label: 'General Support',
                description: 'Get help with ranks, bugs, feedback, or questions.',
                value: 'general'
            },
            {
                label: 'Report a User',
                description: 'Report a user for breaking server/game rules.',
                value: 'report'
            },
            {
                label: 'Report a Staff Member',
                description: 'Report a staff member if you feel unjustly moderated.',
                value: 'reportStaff'
            }
        ]);

    const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(dropdown);

    await channel.send({
        embeds: [embed],
        components: [actionRow]
    });
};

