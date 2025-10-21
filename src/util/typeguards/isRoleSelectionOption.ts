import {roleSelectionOption, RoleSelectionOption} from "../types/RoleSelection";

/**
 * Checks if a given string is a valid `roleSelectionOption`.
 *
 * @param {string} value - The string to check.
 * @returns {value is roleSelectionOption} `true` if the string is a valid role selection option, otherwise `false`.
 */
export const isRoleSelectionOption: Function = (value: string): value is roleSelectionOption => {
    return Object.values(RoleSelectionOption).includes(value as roleSelectionOption);
}
