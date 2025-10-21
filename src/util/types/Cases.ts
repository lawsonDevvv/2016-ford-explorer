export const blacklistRoles = {
    ticketBlacklist: '1373746940214509740',
    countingBlacklist: '1396786181282201671',
    giveawayBlacklist: '1396783949706956811',
    runBlacklist: '1317186437959127180'
}

export type blacklistType = 'countingBlacklist' | 'ticketBlacklist' | 'giveawayBlacklist' | 'runBlacklist';

export enum CaseType {
    CountingBlacklist = 0,
    TicketBlacklist = 1,
    GiveawayBlacklist = 2,
    RunBlacklist = 3,
    CountingUnblacklist = 4,
    TicketUnblacklist = 5,
    GiveawayUnblacklist = 6,
    RunUnblacklist = 7
}

export const CaseTypeMetadata = {
    // Converting raw case types to pretty text
    [CaseType.CountingBlacklist]: 'Counting',
    [CaseType.TicketBlacklist]: 'Ticket',
    [CaseType.GiveawayBlacklist]: 'Giveaway',
    [CaseType.RunBlacklist]: 'Run',
    [CaseType.CountingUnblacklist]: 'Counting Unblacklist',
    [CaseType.TicketUnblacklist]: 'Ticket Unblacklist',
    [CaseType.GiveawayUnblacklist]: 'Giveaway Unblacklist',
    [CaseType.RunUnblacklist]: 'Run Unblacklist',
    // Does the exact opposite
    'countingBlacklist': 0,
    'ticketBlacklist': 1,
    'giveawayBlacklist': 2,
    'runBlacklist': 3,
    'countingUnblacklist': 4,
    'ticketUnblacklist': 5,
    'giveawayUnblacklist': 6,
    'runUnblacklist': 7,

}

export enum CaseStatus {
    Open = 0,
    Closed = 1,
    Rescinded = 2
}