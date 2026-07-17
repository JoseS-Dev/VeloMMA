export enum BonusType {
    FIGHT_OF_THE_NIGHT = 'Fight_of_the_night',
    PERFORMANCE_OF_THE_NIGHT = 'Performance_of_the_night',
    SUBMISSION_OF_THE_NIGHT = 'Submission_of_the_night',
    KNOCKOUT_OF_THE_NIGHT = 'Knockout_of_the_night'
}

/**
 * Mock para crear un bono de Pelea de la Noche
 */
export const mockCreateBonusFightOfTheNight = {
    bout_id: 0, // Se asignará después
    fighter_id: 0, // Se asignará después
    bonus_type: BonusType.FIGHT_OF_THE_NIGHT
};

/**
 * Mock para crear un bono de Actuación de la Noche
 */
export const mockCreateBonusPerformanceOfTheNight = {
    bout_id: 0,
    fighter_id: 0,
    bonus_type: BonusType.PERFORMANCE_OF_THE_NIGHT
};

export const mockUpdateBonus = {
    bonus_type: BonusType.KNOCKOUT_OF_THE_NIGHT
};