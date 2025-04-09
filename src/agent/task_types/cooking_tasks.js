import { getPosition } from "../library/world.js";

export class CookingTaskInitiator {
    constructor(data, agent) {
        this.agent = agent;
        this.data = data;
    }

    async init() {
        let bot = this.agent.bot;

        //// Setting up the cooking world using minecraft cheats ////
        
        // Only run the setup if the agent is the first one

        if (this.agent.count_id === 0) {
            // Clear and prepare the base area
            await bot.chat(`/fill 0 -1 0 50 -3 50 grass_block`);
            await bot.chat(`/fill 0 -1 0 -50 -3 50 grass_block`);
            await bot.chat(`/fill 0 -1 0 -50 -3 -50 grass_block`);
            await bot.chat(`/fill 0 -1 0 50 -3 -50 grass_block`);
            await bot.chat(`/fill 0 0 0 50 10 50 air`);
            await bot.chat(`/fill 0 0 0 -50 10 50 air`);
            await bot.chat(`/fill 0 0 0 -50 10 -50 air`);
            await bot.chat(`/fill 0 0 0 50 10 -50 air`);

            const position = {x: 0, y: 0, z: 0};
            const botX = Math.floor(position.x);
            const botZ = Math.floor(position.z);

            // Define organized crop layout
            // Start crops in a field area to the north of bot position
            const cropStartX = botX - 15;
            const cropStartZ = botZ - 25;
            
            // Track occupied regions for house placement and chest
            const occupiedRegions = [{
                xMin: botX - 1,
                xMax: botX + 1,
                zMin: botZ - 1, 
                zMax: botZ + 1
            }];
            
            // Set up crop positions in a garden layout
            const regionPositions = {
                wheat: { xStart: cropStartX, zStart: cropStartZ },
                beetroots: { xStart: cropStartX + 8, zStart: cropStartZ },
                potatoes: { xStart: cropStartX + 14, zStart: cropStartZ },
                carrots: { xStart: cropStartX + 20, zStart: cropStartZ },
                mushrooms: { xStart: cropStartX, zStart: cropStartZ + 8 },
                pumpkins: { xStart: cropStartX + 6, zStart: cropStartZ + 8 },
                sugar_cane: [
                    { xStart: cropStartX + 18, zStart: cropStartZ + 8 },
                    { xStart: cropStartX + 24, zStart: cropStartZ + 8 }
                ],
                house: { xStart: cropStartX + 10, zStart: cropStartZ + 15 }
            };
            
            // Add crop regions to occupied regions
            occupiedRegions.push(
                { xMin: cropStartX, xMax: cropStartX + 26, zMin: cropStartZ, zMax: cropStartZ + 30 }
            );

            // Planting functions with dynamic positions
            const plantWheat = async (xStart, zStart) => {
                for (let i = 0; i < 6; i++) {
                    for (let j = 0; j < 6; j++) {
                        const x = xStart + i;
                        const z = zStart + j;
                        await bot.chat(`/setblock ${x} ${position.y - 1} ${z} farmland`);
                        await bot.chat(`/setblock ${x} ${position.y} ${z} wheat[age=7]`);
                    }
                }
            };

            const plantBeetroots = async (xStart, zStart) => {
                for (let i = 0; i < 4; i++) {
                    for (let j = 0; j < 5; j++) {
                        const x = xStart + i;
                        const z = zStart + j;
                        await bot.chat(`/setblock ${x} ${position.y - 1} ${z} farmland`);
                        await bot.chat(`/setblock ${x} ${position.y} ${z} beetroots[age=3]`);
                    }
                }
            };

            const plantMushrooms = async (xStart, zStart) => {
                for (let i = 0; i < 4; i++) {
                    for (let j = 0; j < 5; j++) {
                        const x = xStart + i;
                        const z = zStart + j;
                        await bot.chat(`/setblock ${x} ${position.y - 1} ${z} mycelium`);
                        const mushroomType = (i + j) % 2 === 0 ? 'red_mushroom' : 'brown_mushroom';
                        await bot.chat(`/setblock ${x} ${position.y} ${z} ${mushroomType}`);
                    }
                }
            };

            const plantPotatoes = async (xStart, zStart) => {
                for (let i = 0; i < 4; i++) {
                    for (let j = 0; j < 5; j++) {
                        const x = xStart + i;
                        const z = zStart + j;
                        await bot.chat(`/setblock ${x} ${position.y - 1} ${z} farmland`);
                        await bot.chat(`/setblock ${x} ${position.y} ${z} potatoes[age=7]`);
                    }
                }
            };

            const plantCarrots = async (xStart, zStart) => {
                for (let i = 0; i < 4; i++) {
                    for (let j = 0; j < 5; j++) {
                        const x = xStart + i;
                        const z = zStart + j;
                        await bot.chat(`/setblock ${x} ${position.y - 1} ${z} farmland`);
                        await bot.chat(`/setblock ${x} ${position.y} ${z} carrots[age=7]`);
                    }
                }
            };

            const plantSugarCane = async (patches) => {
                for (const patch of patches) {
                    const xCenter = patch.xStart + 1;
                    const zCenter = patch.zStart + 1;
                    await bot.chat(`/setblock ${xCenter} ${position.y - 1} ${zCenter} water`);
                    const offsets = [[1, 0], [-1, 0], [0, 1], [0, -1]];
                    for (const [dx, dz] of offsets) {
                        await bot.chat(`/setblock ${xCenter + dx} ${position.y} ${zCenter + dz} sugar_cane[age=15]`);
                    }
                }
            };

            const plantPumpkins = async (xStart, zStart) => {
                for (let i = 0; i < 10; i++) {
                    const x = xStart + i;
                    const z = zStart;
                    await bot.chat(`/setblock ${x} ${position.y} ${z} pumpkin`);
                }
            };

            // Execute all planting in the organized layout
            await plantWheat(regionPositions.wheat.xStart, regionPositions.wheat.zStart);
            await new Promise(resolve => setTimeout(resolve, 300));
            await plantBeetroots(regionPositions.beetroots.xStart, regionPositions.beetroots.zStart);
            await new Promise(resolve => setTimeout(resolve, 300));
            await plantMushrooms(regionPositions.mushrooms.xStart, regionPositions.mushrooms.zStart);
            await new Promise(resolve => setTimeout(resolve, 300));
            await plantPotatoes(regionPositions.potatoes.xStart, regionPositions.potatoes.zStart);
            await new Promise(resolve => setTimeout(resolve, 300));
            await plantCarrots(regionPositions.carrots.xStart, regionPositions.carrots.zStart);
            await new Promise(resolve => setTimeout(resolve, 300));
            await plantSugarCane(regionPositions.sugar_cane);
            await new Promise(resolve => setTimeout(resolve, 300));
            await plantPumpkins(regionPositions.pumpkins.xStart, regionPositions.pumpkins.zStart);
            await new Promise(resolve => setTimeout(resolve, 300));

            // House construction
            const buildHouse = async (xStart, zStart) => {
                const startX = xStart;
                const startY = position.y;
                const startZ = zStart;
                const width = 10;
                const depth = 10;
                const height = 5;

                // Foundation and walls
                for (let x = startX; x <= startX + depth; x++) {
                    for (let y = startY; y <= startY + height; y++) {
                        for (let z = startZ; z <= startZ + width; z++) {
                            if (y === startY) {
                                if (!(x === startX + depth - 1 && z === startZ + Math.floor(width / 2))) {
                                    await bot.chat(`/setblock ${x} ${y} ${z} stone_bricks`);
                                }
                                continue;
                            }
                            
                            if (x === startX || x === startX + depth ||
                                z === startZ || z === startZ + width ||
                                y === startY + height) {
                                
                                const isWindow = (
                                    (x === startX || x === startX + depth) && 
                                    (z === startZ + 3 || z === startZ + width - 3) &&
                                    (y === startY + 2 || y === startY + 3)
                                ) || (
                                    (z === startZ || z === startZ + width) && 
                                    (x === startX + 3 || x === startX + depth - 3) &&
                                    (y === startY + 2 || y === startY + 3)
                                );
                                
                                const isDoor = x === startX + depth && 
                                                z === startZ + Math.floor(width / 2) &&
                                                (y === startY + 1 || y === startY + 2);

                                if (!isWindow && !isDoor) {
                                    await bot.chat(`/setblock ${x} ${y} ${z} stone_bricks`);
                                }
                            }
                        }
                    }
                }

                // Entrance features
                const doorZ = startZ + Math.floor(width / 2);
                await bot.chat(`/setblock ${startX + depth - 1} ${startY} ${doorZ} stone_brick_stairs[facing=west]`);
                await bot.chat(`/setblock ${startX + depth} ${startY} ${doorZ} air`);
                // await bot.chat(`/setblock ${startX + depth - 1} ${startY} ${doorZ - 1} stone_bricks`);
                // await bot.chat(`/setblock ${startX + depth - 1} ${startY} ${doorZ + 1} stone_bricks`);
                // await bot.chat(`/setblock ${startX + depth} ${startY} ${doorZ} oak_door[half=lower,hinge=left,facing=west,powered=false]`);
                // await bot.chat(`/setblock ${startX + depth} ${startY + 1} ${doorZ} oak_door[half=upper,hinge=left,facing=west,powered=false]`);

                // Roof construction
                for (let i = 0; i < 3; i++) {
                    for (let x = startX + i; x <= startX + depth - i; x++) {
                        for (let z = startZ + i; z <= startZ + width - i; z++) {
                            if (x === startX + i || x === startX + depth - i ||
                                z === startZ + i || z === startZ + width - i) {
                                await bot.chat(`/setblock ${x} ${startY + height + i} ${z} cobblestone`);
                            }
                        }
                    }
                }

                // Interior items
                await bot.chat(`/setblock ${startX + 4} ${startY + 1} ${startZ + 3} crafting_table`);
                await bot.chat(`/setblock ${startX + 4} ${startY + 1} ${startZ + 5} furnace`);
                // Add fuel to the furnace
                await bot.chat(`/data merge block ${startX + 4} ${startY + 1} ${startZ + 5} {Items:[{Slot:1b,id:"minecraft:coal",Count:64b}]}`)
                await bot.chat(`/setblock ${startX + 4} ${startY + 1} ${startZ + 7} smoker`);
                // Add fuel to the smoker
                await bot.chat(`/data merge block ${startX + 4} ${startY + 1} ${startZ + 7} {Items:[{Slot:1b,id:"minecraft:coal",Count:64b}]}`)
                await bot.chat(`/setblock ${startX + depth - 3} ${startY + 1} ${startZ + 2} bed`);
            };

            await buildHouse(regionPositions.house.xStart, regionPositions.house.zStart);
            await new Promise(resolve => setTimeout(resolve, 300));

            // Add a chest with cooking items near the bot
            const addChestWithItems = async () => {
                // Place chest in a fixed position near bot
                const x = botX + 3;
                const z = botZ + 3;
                const y = position.y;

                // Place the chest
                await bot.chat(`/setblock ${x} ${y} ${z} chest`);

                const cookingItems = [
                    ['minecraft:milk_bucket', 1],     // Non-stackable
                    ['minecraft:egg', 16],            // Stacks to 16
                    ['minecraft:dandelion', 64],    // Stacks to 64
                    ['minecraft:sugar', 64],
                    ['minecraft:cocoa_beans', 64],
                    ['minecraft:apple', 64],
                    ['minecraft:milk_bucket', 1],
                    ['minecraft:milk_bucket', 1],
                    ['minecraft:salmon', 64],
                    ['minecraft:cod', 64],
                    ['minecraft:kelp', 64],
                    ['minecraft:dried_kelp', 64],
                    ['minecraft:sweet_berries', 64],
                    ['minecraft:honey_bottle', 1],     // Non-stackable
                    ['minecraft:glow_berries', 64],
                    ['minecraft:bowl', 64],
                    ['minecraft:milk_bucket', 1],
                    ['minecraft:milk_bucket', 1],
                    ['minecraft:milk_bucket', 1],
                    ['minecraft:milk_bucket', 1],
                    ['minecraft:cooked_salmon', 64],
                    ['minecraft:cooked_cod', 64],
                    ['minecraft:gold_ingot', 64],
                    ['minecraft:oak_planks', 64],
                    ['minecraft:iron_ingot', 64],
                    ['minecraft:milk_bucket', 1],
                    ['minecraft:milk_bucket', 1],
                ];

                // Fill the chest with random cooking items
                for (let slot = 0; slot < cookingItems.length; slot++) { // Chest has 27 slots
                    const randomItem = cookingItems[slot];
                    await bot.chat(`/item replace block ${x} ${y} ${z} container.${slot} with ${randomItem[0]} ${randomItem[1]}`);
                }

                // Mark the chest area as occupied
                occupiedRegions.push({
                    xMin: x,
                    xMax: x,
                    zMin: z,
                    zMax: z
                });
            };

            await addChestWithItems();
            await new Promise(resolve => setTimeout(resolve, 300));

            // Animal management
            await bot.chat('/kill @e[type=item,distance=..200]');
            await bot.chat('/kill @e[type=chicken,distance=..200]');
            await bot.chat('/kill @e[type=cow,distance=..200]');
            await bot.chat('/kill @e[type=llama,distance=..200]');
            await bot.chat('/kill @e[type=mooshroom,distance=..200]');
            await bot.chat('/kill @e[type=pig,distance=..200]');
            await bot.chat('/kill @e[type=rabbit,distance=..200]');
            await bot.chat('/kill @e[type=sheep,distance=..200]');

            await bot.chat(`/kill @e[type=item,distance=..200]`);

            await new Promise(resolve => setTimeout(resolve, 300));

            // Summon new animals
            const summonAnimals = async () => {
                const animals = ['chicken', 'cow', 'llama', 'mooshroom', 'pig', 'rabbit', 'sheep'];
                for (const animal of animals) {
                    for (let i = 0; i < 8; i++) {
                        const x = position.x - 25 + Math.random() * 50;
                        const z = position.z - 25 + Math.random() * 50;
                        await bot.chat(`/summon ${animal} ${Math.floor(x)} ${position.y} ${Math.floor(z)}`);
                    }
                }
            };
            await summonAnimals();
        }
    }
}