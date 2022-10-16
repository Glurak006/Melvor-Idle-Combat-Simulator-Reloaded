/*  Melvor Idle Combat Simulator

    Copyright (C) <2020>  <Coolrox95>
    Modified Copyright (C) <2020> <Visua0>
    Modified Copyright (C) <2020, 2021> <G. Miclotte>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

(() => {

    const reqs: any = [];

    const setup = () => {

        // global combat simulator object
        const MICSR = (window as any).MICSR;

        // combat sim name
        MICSR.name = 'Melvor Idle Combat Simulator Reloaded';
        MICSR.shortName = 'Combat Simulator';

        // compatible game version
        MICSR.gameVersion = 'v1.1';

        // combat sim version
        MICSR.majorVersion = 1;
        MICSR.minorVersion = 7;
        MICSR.patchVersion = 0;
        MICSR.preReleaseVersion = undefined;
        MICSR.version = `v${MICSR.majorVersion}.${MICSR.minorVersion}.${MICSR.patchVersion}`;
        if (MICSR.preReleaseVersion !== undefined) {
            MICSR.version = `${MICSR.version}-${MICSR.preReleaseVersion}`;
        }

        MICSR.versionCheck = (exact: any, major: any, minor: any, patch: any, prerelease: any) => {
            // check exact version match
            if (major === MICSR.majorVersion
                && minor === MICSR.minorVersion
                && patch === MICSR.patchVersion
                && prerelease === MICSR.preReleaseVersion) {
                return true;
            }
            if (exact) {
                // exact match is required
                return false;
            }
            // check minimal version match
            if (major !== MICSR.majorVersion) {
                return major < MICSR.majorVersion;
            }
            if (minor !== MICSR.minorVersion) {
                return minor < MICSR.minorVersion;

            }
            if (patch !== MICSR.patchVersion) {
                return patch < MICSR.patchVersion;
            }
            if (MICSR.preReleaseVersion !== undefined) {
                if (prerelease === undefined) {
                    // requires release version
                    return false;
                }
                return prerelease < MICSR.preReleaseVersion;
            }
            // this is release version, and either pre-release or release is required, so we're good
            return true;
        }

        // simulation settings
        MICSR.trials = 1e3;
        MICSR.maxTicks = 1e3;

        // empty items
        const makeEmptyItem = (img: any, slot: any) => {
            return {
                name: 'None',
                id: -1,
                media: img,
                validSlots: [slot]
            }
        };

        MICSR.emptyItems = {
            Helmet: makeEmptyItem('assets/media/bank/armour_helmet.png', 'Helmet'),
            Platebody: makeEmptyItem('assets/media/bank/armour_platebody.png', 'Platebody'),
            Platelegs: makeEmptyItem('assets/media/bank/armour_platelegs.png', 'Platelegs'),
            Boots: makeEmptyItem('assets/media/bank/armour_boots.png', 'Boots'),
            Weapon: {
                ...makeEmptyItem('assets/media/bank/weapon_sword.png', 'Weapon'),
                attackType: 'melee',
            },
            Shield: makeEmptyItem('assets/media/bank/armour_shield.png', 'Shield'),
            Amulet: makeEmptyItem('assets/media/bank/misc_amulet.png', 'Amulet'),
            Ring: makeEmptyItem('assets/media/bank/misc_ring.png', 'Ring'),
            Gloves: makeEmptyItem('assets/media/bank/armour_gloves.png', 'Gloves'),
            Quiver: makeEmptyItem('assets/media/bank/weapon_quiver.png', 'Quiver'),
            Cape: makeEmptyItem('assets/media/bank/armour_cape.png', 'Cape'),
            Passive: makeEmptyItem('assets/media/bank/passive_slot.png', 'Passive'),
            Summon1: makeEmptyItem('assets/media/bank/misc_summon.png', 'Summon1'),
            Summon2: makeEmptyItem('assets/media/bank/misc_summon.png', 'Summon2'),
            Food: makeEmptyItem('assets/media/skills/combat/food_empty.svg', 'Food'),
        };

        MICSR.getItem = (itemID: any, slotName: any) => {
            if (itemID === -1) {
                return MICSR.emptyItems[slotName];
            }
            return MICSR.items.getObjectByID(itemID);
        }

        // @ts-expect-error TS(2304): Cannot find name 'game'.
        MICSR.actualGame = game;
        MICSR.game = MICSR.actualGame; // TODO this should be a mock game object probably
        MICSR.namespace = MICSR.game.registeredNamespaces.registeredNamespaces.get('micsr');
        if (MICSR.namespace === undefined) {
            MICSR.namespace = MICSR.game.registeredNamespaces.registerNamespace("micsr", 'Combat Simulator', true);
        }
        // skill IDs
        MICSR.skillIDs = {};
        MICSR.skillNames = [];
        MICSR.skillNamesLC = [];
        MICSR.game.skills.allObjects.forEach((x: any, i: number) => {
            MICSR.skillIDs[x.name] = i;
            MICSR.skillNames.push(x.name);
            MICSR.skillNamesLC.push(x.name.toLowerCase());
        });
        // pets array
        MICSR.pets = MICSR.game.pets;
        // dg array
        MICSR.dungeons = MICSR.game.dungeons;
        // TODO filter special dungeons
        //  MICSR.dungeons = MICSR.dungeons.filter((dungeon) => dungeon.id !== Dungeons.Impending_Darkness);
        // TODO filter special monsters
        //  MICSR.dungeons[Dungeons.Into_the_Mist].monsters = [147, 148, 149];
        // monster array
        MICSR.monsters = MICSR.game.monsters;
        MICSR.bardID = 'melvorF:WanderingBard';
        // areas
        MICSR.combatAreas = MICSR.game.combatAreas;
        MICSR.slayerAreas = MICSR.game.slayerAreas;
        // @ts-expect-error TS(2304): Cannot find name 'SlayerTask'.
        MICSR.slayerTaskData = SlayerTask.data
        // potions
        MICSR.herblorePotions = MICSR.game.herblore.actions;
        // items
        MICSR.items = MICSR.game.items;
        // spells
        MICSR.standardSpells = MICSR.game.standardSpells;
        MICSR.curseSpells = MICSR.game.curseSpells;
        MICSR.auroraSpells = MICSR.game.auroraSpells;
        MICSR.ancientSpells = MICSR.game.ancientSpells;
        MICSR.archaicSpells = MICSR.game.archaicSpells;
        // prayers
        MICSR.prayers = MICSR.game.prayers;

        /**
         }
         * Formats a number with the specified number of sigfigs, Addings suffixes as required
         * @param {number} number Number
         * @param {number} digits Number of significant digits
         * @return {string}
         */
        MICSR.mcsFormatNum = (number: any, digits: any) => {
            let output = number.toPrecision(digits);
            let end = '';
            if (output.includes('e+')) {
                const power = parseInt(output.match(/\d*?$/));
                const powerCount = Math.floor(power / 3);
                output = `${output.match(/^[\d,\.]*/)}e+${power % 3}`;
                const formatEnd = ['', 'k', 'M', 'B', 'T'];
                if (powerCount < formatEnd.length) {
                    end = formatEnd[powerCount];
                } else {
                    end = `e${powerCount * 3}`;
                }
            }
            // @ts-expect-error TS(2554): Expected 0 arguments, but got 2.
            return `${+parseFloat(output).toFixed(6).toLocaleString(undefined, {minimumSignificantDigits: digits})}${end}`;
        }

        /**
         * Creates an id for an element from a name
         * @param {string} name The name describing the element
         * @returns An id starting with 'mcs-' and ending with the name in lowercase with spaces replaced by '-'
         */
        MICSR.toId = (name: any) => {
            return `mcs-${name.toLowerCase().replace(/ /g, '-')}`;
        }

        MICSR.checkImplemented = (stats: any, tag: any) => {
            if (!MICSR.isDev) {
                return;
            }
            Object.getOwnPropertyNames(stats).forEach(stat => {
                if (Array.isArray(stats[stat])) {
                    for (const substat of stats[stat]) {
                        if (!substat.implemented) {
                            MICSR.warn(tag + ' not yet implemented: ' + stat);
                        }
                    }
                } else if (!stats[stat].implemented) {
                    MICSR.warn(tag + ' stat not yet implemented: ' + stat);
                }
            })
        }

        MICSR.checkUnknown = (set: any, tag: any, elementType: any, knownSets: any, broken: any) => {
            if (!MICSR.isDev) {
                return;
            }
            // construct a list of stats that are not in any of the previous categories
            const unknownStatNames = {};
            set.forEach((element: any) => {
                Object.getOwnPropertyNames(element).forEach(stat => {
                    // check if any bugged stats are still present
                    if (broken[stat] !== undefined) {
                        MICSR.warn(tag + ' stat ' + stat + ' is bugged for ' + element.name + '!')
                        return;
                    }
                    // check if we already know this stat
                    for (const known of knownSets) {
                        if (known[stat] !== undefined) {
                            return;
                        }
                    }
                    // unknown stat found !
                    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    if (unknownStatNames[stat] === undefined) {
                        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                        unknownStatNames[stat] = [];
                    }
                    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    unknownStatNames[stat].push(element.name);
                })
            })

            Object.getOwnPropertyNames(unknownStatNames).forEach(stat => {
                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                MICSR.warn('Unknown stat ' + stat + ' for ' + elementType + ': ', unknownStatNames[stat]);
            });
        }

        /**
         * Get the combined modifier value
         */
        MICSR.getModifierValue = (...args: any[]) => {
            return MICSR.showModifiersInstance.getModifierValue(...args);
        }

        /**
         * Apply modifier without rounding
         */
        MICSR.averageDoubleMultiplier = (modifier: any) => {
            return 1 + modifier / 100;
        }

        /**
         * Add agility course modifiers to `modifiers` object
         */
        MICSR.addAgilityModifiers = (course: any, courseMastery: any, pillar: any, modifiers: any) => {
            let fullCourse = true
            for (let i = 0; i < course.length; i++) {
                if (course[i] < 0) {
                    fullCourse = false;
                    break;
                }
                if (courseMastery[i]) {
                    // @ts-expect-error TS(2304): Cannot find name 'Agility'.
                    modifiers.addModifiers(Agility.obstacles[course[i]].modifiers, 0.5);
                } else {
                    // @ts-expect-error TS(2304): Cannot find name 'Agility'.
                    modifiers.addModifiers(Agility.obstacles[course[i]].modifiers);
                }
            }
            if (fullCourse && pillar > -1) {
                // @ts-expect-error TS(2304): Cannot find name 'Agility'.
                modifiers.addModifiers(Agility.passivePillars[pillar].modifiers);
            }
        }
    }

    let loadCounter = 0;
    const waitLoadOrder = (reqs: any, setup: any, id: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'characterSelected'.
        if (typeof characterSelected === typeof undefined) {
            return;
        }
        // @ts-expect-error TS(2304): Cannot find name 'characterSelected'.
        let reqMet = characterSelected && confirmedLoaded;
        if (reqMet) {
            loadCounter++;
        }
        if (loadCounter > 100) {
            console.log('Failed to load ' + id);
            return;
        }
        // check requirements
        if ((window as any).MICSR === undefined) {
            reqMet = false;
            console.log(id + ' is waiting for the MICSR object');
        } else {
            for (const req of reqs) {
                if ((window as any).MICSR.loadedFiles[req]) {
                    continue;
                }
                reqMet = false;
                // not defined yet: try again later
                if (loadCounter === 1) {
                    (window as any).MICSR.log(id + ' is waiting for ' + req);
                }
            }
        }
        if (!reqMet) {
            setTimeout(() => waitLoadOrder(reqs, setup, id), 50);
            return;
        }
        // requirements met
        (window as any).MICSR.log('setting up ' + id);
        setup();
        // mark as loaded
        (window as any).MICSR.loadedFiles[id] = true;
    }
    waitLoadOrder(reqs, setup, 'util');

})();