export enum Ranks {
    Guest = 0,
    Member = 1,
    MemberPlus = 150,
    Booster = 151,
    CoolPerson = 160,
    NotedMember = 161,
    TrainOperator = 162,
    Inspector = 163,
    TrialModerator = 165,
    Contractor = 165,
    Moderator = 170,
    SeniorModerator = 180,
    CommunityAdministrator = 181,
    Developer = 200,
    LeadDeveloper = 201,
    CommunityManager = 203,
    FounderCEO = 254,
    Owner = 255
}

export enum GroupRanks {
    Booster = 'booster',
    MemberPlus = 'memberPlus',
    Member = 'member'
}

export enum UniverseID {
    FultonStreet = 6877448005,
    TheRockaways = 5523418888
}

export type CMTZUniverse = "fultonSt" | "theRockaways";

export const UniverseIDMetadata = {
    [UniverseID.FultonStreet]: "Fulton Street",
    [UniverseID.TheRockaways]: "The Rockaways",
    fultonSt: UniverseID.FultonStreet,
    theRockaways: UniverseID.TheRockaways
}

export const RanksMetadata = {
    [Ranks.Guest]: "Guest",
    [Ranks.Member]: "Member",
    [Ranks.MemberPlus]: "Member+",
    [Ranks.Booster]: "Booster",
    [Ranks.CoolPerson]: "Cool Person",
    [Ranks.NotedMember]: "Noted Member",
    [Ranks.TrainOperator]: "Train Operator",
    [Ranks.Inspector]: "Inspector",
    [Ranks.TrialModerator]: "Trial Moderator/Contractor",
    [Ranks.Moderator]: "Moderator",
    [Ranks.SeniorModerator]: "Senior Moderator",
    [Ranks.CommunityAdministrator]: "Community Administrator",
    [Ranks.Developer]: "Developer",
    [Ranks.LeadDeveloper]: "Lead Developer",
    [Ranks.CommunityManager]: "Community Manager",
    [Ranks.FounderCEO]: "Founder/CEO",
    [Ranks.Owner]: "Owner",
    guest: Ranks.Guest,
    member: Ranks.Member,
    memberPlus: Ranks.MemberPlus,
    booster: Ranks.Booster,
    coolPerson: Ranks.CoolPerson,
    notedMember: Ranks.NotedMember,
    trainOperator: Ranks.TrainOperator,
    inspector: Ranks.Inspector,
    trialModerator: Ranks.TrialModerator,
    contractor: Ranks.Contractor,
    moderator: Ranks.Moderator,
    seniorModerator: Ranks.SeniorModerator, // typo carried over from enum
    communityAdministrator: Ranks.CommunityAdministrator,
    developer: Ranks.Developer,
    leadDeveloper: Ranks.LeadDeveloper,
    communityManager: Ranks.CommunityManager,
    founderCeo: Ranks.FounderCEO,
    owner: Ranks.Owner,
};

export interface GameJoinRestriction {
    active: false,
    startTime: Date,
    duration?: number;
    privateReason: string,
    displayReason: string,
    excludeAltAccounts: true,
    inherited: boolean
}

export interface MinimalGameJoinRestriction {
    active: false
}

export interface VerboseGameJoinRestriction extends GameJoinRestriction {
    path: string,
    user: string
}

export interface APIBanResponse {
    gameJoinRestriction: GameJoinRestriction
    nextPageToken: string,
}

export interface APIUnbanResponse {
    gameJoinRestriction: MinimalGameJoinRestriction
}

