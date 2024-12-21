/**
 * @description Enumerator for Giveaway Statuses.
 */
enum GiveawayStatus {
    Active = 0,
    Ended = 1,
    Rerolled = 2
}

/**
 * @description Metadata object to fetch giveaway type from an integer.
 */
export const GiveawayStatusMetadata = {
    [GiveawayStatus.Active]: "Active",
    [GiveawayStatus.Ended]: "Ended",
    [GiveawayStatus.Rerolled]: "Active"
}

export default GiveawayStatus;
