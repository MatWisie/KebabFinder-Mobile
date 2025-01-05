import { OpeningHour } from "./KebabTypes";

export interface FilterResult{
    filterSelectedMeats: string[],
    filterSelectedSauces: string[],
    filterSelectedStatuses: string[],
    filterSelectedBuildingTypes: string[],
    filterIsCraft: boolean | null,
    filterIsChain: boolean | null,
    filterHasApp: boolean | null,
    filterHasPhone: boolean | null,
    filterHasWebsite: boolean | null,
    filterDayOfWeek: OpeningHour
}