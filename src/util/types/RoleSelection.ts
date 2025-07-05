export enum RoleSelectionOption {
    DevelopmentPings = 'developmentPings',
    AnnouncementPings = 'announcementPings',
    WallOfShamePings = 'wallOfShamePings',
    BullshitPings = "bullshitPings",
    EventPings = 'eventPings',
}

export type roleSelectionOption = (typeof RoleSelectionOption)[keyof typeof RoleSelectionOption];

export const roleSelectionRoleIDs = {
    [RoleSelectionOption.DevelopmentPings]: '1254488188236599306',
    [RoleSelectionOption.AnnouncementPings]: '1229076056451973151',
    [RoleSelectionOption.WallOfShamePings]: '1368686487331147848',
    [RoleSelectionOption.BullshitPings]: '1368686522504712343',
    [RoleSelectionOption.EventPings]: '1272433812957298798'
}
