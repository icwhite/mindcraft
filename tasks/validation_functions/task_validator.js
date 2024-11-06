import settings from '../../settings.js';
import minecraftData from 'minecraft-data';

const mc_version = settings.minecraft_version;
const mcData = minecraftData('1.16.5');

export class TechTreeHarvestValidator {
    constructor(target, number_of_target) {
        this.target = target;
        this.number_of_target = number_of_target;
    }

    validate(bot) {
        // validate that bot has the item
        bot.inventory.slots.forEach((slot) => {
            if (slot && slot.name === this.target && slot.count >= this.number_of_target) {
                return true;
            }
        });
        return false;
    }
}

