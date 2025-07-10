export enum RoleSelectionOption {
    DevelopmentPings = 'developmentPingsButton',
    AnnouncementPings = 'announcementPingsButton',
    WallOfShamePings = 'wallOfShamePingsButton',
    BullshitPings = 'bullshitPingsButton',
    EventPings = 'eventPingsButton',
    TrainingPings = 'trainingPingsButton',
}

export type roleSelectionOption = (typeof RoleSelectionOption)[keyof typeof RoleSelectionOption];

export const roleSelectionRoleIDs = {
    [RoleSelectionOption.DevelopmentPings]: '1254488188236599306',
    [RoleSelectionOption.AnnouncementPings]: '1229076056451973151',
    [RoleSelectionOption.WallOfShamePings]: '1368686487331147848',
    [RoleSelectionOption.BullshitPings]: '1368686522504712343',
    [RoleSelectionOption.EventPings]: '1272433812957298798',
    [RoleSelectionOption.TrainingPings]: '1392092560788291685'
}
