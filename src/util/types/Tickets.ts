export type ticketType = 'general' | 'report' | 'reportStaff';

export enum TicketTypes {
    General = 'general',
    Report = 'report',
    ReportStaff = 'reportStaff'
}

export const TicketTypeMetadata = {
    [TicketTypes.General]: 'General',
    [TicketTypes.Report]: 'Report',
    [TicketTypes.ReportStaff]: 'Report Staff'
}

export const TicketCategories = {
    [TicketTypes.General]: '1216128374548860998',
    [TicketTypes.Report]: '1256032844887621672',
    [TicketTypes.ReportStaff]: '1277523499744886824'
}

export const TicketEmbedColors = {
    [TicketTypes.General]: 0x00FF00,  // Green
    [TicketTypes.Report]: 0xFF8080,   // Light red
    [TicketTypes.ReportStaff]: 0x990000  // Dark red
}

export const TicketRoles = {
    [TicketTypes.General]: '1200951047208841398',
    [TicketTypes.Report]: '1200951047208841398',
    [TicketTypes.ReportStaff]: '1373801295709732864'
}

export enum TicketStatus {
    Open = 0,
    Closed = 1,
    Deleted = 2
}

export const TicketGreetingMessages = {
    [TicketTypes.General]:
        'Thank you for creating a General Inquiry ticket. If this is not the type of ticket you wished to make, you can close this ticket at any time by hitting the close button below this embed.\n\n' +
        '**Please state your inquiry immediately.** If your ticket is blank, it will be closed without further explanation.\n' +
        'If you are requesting to be ranked because you bought the **Member+ game-pass** or **boosted our server**, please state your full username as soon as you create this ticket to avoid confusion between nicknames and actual usernames.\n' +
        'If you are reporting a bug, please include the full step-by-step process required to reproduce the bug, along with any videos or pictures you possess. This allows our developers to better diagnose issues.' +
        'Failure to do the above can result in your ticket being prolonged unnecessarily.',
    [TicketTypes.Report]:
        'Thank you for creating a Report ticket. If this is not the type of ticket you wished to make, you can close this ticket at any time by hitting the close button below this embed.\n\n' +
        '**Please state the member you are reporting now.** If your ticket is blank, it will be closed without further explanation.\n' +
        'If you report a person without proof, theres is a 90% chance that your report will be marked unfounded. Proof is extremely necessary.',
    [TicketTypes.ReportStaff]:
        'Thank you for creating a Report ticket. If this is not the type of ticket you wished to make, you can close this ticket at any time by hitting the close button below this embed.\n\n' +
        '**Please state the staff member you are reporting now.** If your ticket is blank, it will be closed without further explanation.\n' +
        'If you report a staff member without proof, theres is a 90% chance that your report will be marked unfounded. Proof is extremely necessary.',
}
