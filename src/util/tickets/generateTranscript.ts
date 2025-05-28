import {Collection, Message, TextChannel, AttachmentBuilder} from "discord.js";
import {prisma} from "../../Bot";
import {Ticket, TicketSettings} from "@prisma/client";

export default async (channel: TextChannel) => {
    // Fetch all messages by paginating through them
    const allMessages = new Collection<string, Message<true>>();
    let lastId: string | undefined = undefined;
    let keepFetching = true;
    
    // 100 message limit workaround
    while (keepFetching) {
        const options: { limit: number; before?: string } = { limit: 100 };
        if (lastId) options.before = lastId;
        
        const messages: Collection<string, Message<boolean>> = await channel.messages.fetch(options);

        if (messages.size < 100) keepFetching = false;

        messages.forEach((message: Message<boolean>) => {
            if (message.partial) return;
            allMessages.set(message.id, message as Message<true>);
        });

        if (messages.size > 0) {
            const lastMessage: Message | undefined = messages.last();
            if (lastMessage) lastId = lastMessage.id;
        } else {
            keepFetching = false;
        }
    }

    const ticket: Ticket | null = await prisma.ticket.findFirst({
        where: { channel: channel.id }
    });

    const ticketSettings: TicketSettings | null =  await prisma.ticketSettings.findFirst({
        where: { guild: channel.guild.id }
    });

    if (!ticket) throw new Error(`Ticket not found for channel ${channel.id}`);
    if (!ticketSettings) throw new Error(`Ticket settings not found for guild ${channel.guild.id}`);

    const logsChannel = await channel.guild.channels.fetch(ticketSettings.logsChannel);

    if (!logsChannel) throw new Error(`Logs channel not found for guild ${channel.guild.id}`);
    if (!(logsChannel instanceof TextChannel)) throw new Error('Logs channel is not of type TextChannel');

    // Sort messages by timestamp (newest first)
    const sortedMessages: Message<true>[] = Array.from(allMessages.values()).sort((a, b) =>
        b.createdTimestamp - a.createdTimestamp
    );

    const parsedMessagesJson = sortedMessages.map((message: Message<true>) => {
        return {
            id: message.author.id,
            username: message.member?.nickname ?? message.author.username,
            pfp: message.author.displayAvatarURL({ forceStatic: false }),
            sentAt: message.createdAt,
            content: message.content,
            embeds: message.embeds
        }
    });

    const parsedMessages: string[] = sortedMessages.map((message: Message<true>) => {
        return (
            `${message.author.username} (${message.author.id}): 
            ${
                message.content ?? 'No message content. Likely an embed.'
            } ${
                message.attachments.size > 0
                    ? '[Attachments: ' + message.attachments.map(a => a.name).join(', ') + `]`
                    : ''
            }`
        )
    });

    await prisma.ticket.update({
        where: {
            id: ticket.id
        },
        data: {
            transcript: parsedMessagesJson
        }
    });

    const transcriptFileString: string = parsedMessages.join('\n');

    await logsChannel.send({
        files: [
            new AttachmentBuilder(Buffer.from(transcriptFileString), {
                name: `transcript-${ticket.number}.txt`
            })
        ]
    });
}