// Import data models.
import { NovatideCharacterData } from "./data/actor/character-data.mjs";
import { NovatideItemData } from "./data/item/item-data.mjs";
import { NovatideSpeciesData } from "./data/item/species-data.mjs";
import { NovatideFocusData } from "./data/item/focus-data.mjs";
import { NovatideCareerData } from "./data/item/career-data.mjs";
import { NovatideAbilityData } from "./data/item/ability-data.mjs";
// Import document classes.
import { NovatideActor } from "./documents/actor.mjs";
import { NovatideItem } from "./documents/item.mjs";
// Import sheet classes.
import { NovatideActorSheet } from "./sheets/actor-sheet.mjs";
import { NovatideItemSheet } from "./sheets/item-sheet.mjs";
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { NOVATIDE } from "./helpers/config.mjs";

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', async function() {

  console.log(`
███▄▄▄▄    ▄██████▄   ▄█    █▄     ▄████████     ███      ▄█  ████████▄     ▄████████ 
███▀▀▀██▄ ███    ███ ███    ███   ███    ███ ▀█████████▄ ███  ███   ▀███   ███    ███ 
███   ███ ███    ███ ███    ███   ███    ███    ▀███▀▀██ ███▌ ███    ███   ███    █▀  
███   ███ ███    ███ ███    ███   ███    ███     ███   ▀ ███▌ ███    ███  ▄███▄▄▄     
███   ███ ███    ███ ███    ███ ▀███████████     ███     ███▌ ███    ███ ▀▀███▀▀▀     
███   ███ ███    ███ ███    ███   ███    ███     ███     ███  ███    ███   ███    █▄  
███   ███ ███    ███ ███    ███   ███    ███     ███     ███  ███   ▄███   ███    ███ 
 ▀█   █▀   ▀██████▀   ▀██████▀    ███    █▀     ▄████▀   █▀   ████████▀    ██████████ 
  `);

  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.novatide = {
    NovatideActor,
    NovatideItem,
    rollItemMacro
  };

  // Add custom constants for configuration.
  CONFIG.NOVATIDE = NOVATIDE;

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20 + @abilities.dex.mod",
    decimals: 2
  };

  // Configure relevant Data Models
  CONFIG.Actor.dataModels.character = NovatideCharacterData;
  CONFIG.Actor.trackableAttributes = {
    character: {
      bar: ['injury'],
      value: ['resolve.value', 'traits.physical.value', 'traits.magical.value', 'traits.mental.value']
    }
  }

  CONFIG.Item.dataModels.item = NovatideItemData;
  CONFIG.Item.dataModels.species = NovatideSpeciesData;
  CONFIG.Item.dataModels.focus = NovatideFocusData;
  CONFIG.Item.dataModels.career = NovatideCareerData;
  CONFIG.Item.dataModels.ability = NovatideAbilityData;


  // Define custom Document classes
  CONFIG.Actor.documentClass = NovatideActor;
  CONFIG.Item.documentClass = NovatideItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("novatide", NovatideActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("novatide", NovatideItemSheet, { makeDefault: true });

  Handlebars.registerHelper('isMaimed', (cur, max) => {
    return cur >= Math.ceil(max * 0.75);
  });

  Handlebars.registerHelper('isDying', (cur, max) => {
    return cur >= max;
  });

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here are a few useful examples:
Handlebars.registerHelper('concat', function() {
  var outStr = '';
  for (var arg in arguments) {
    if (typeof arguments[arg] != 'object') {
      outStr += arguments[arg];
    }
  }
  return outStr;
});

Handlebars.registerHelper('toLowerCase', function(str) {
  return str.toLowerCase();
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once("ready", async function() {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => createItemMacro(data, slot));
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createItemMacro(data, slot) {
  // First, determine if this is a valid owned item.
  if (data.type !== "Item") return;
  if (!data.uuid.includes('Actor.') && !data.uuid.includes('Token.')) {
    return ui.notifications.warn("You can only create macro buttons for owned Items");
  }
  // If it is, retrieve it based on the uuid.
  const item = await Item.fromDropData(data);

  // Create the macro command using the uuid.
  const command = `game.novatide.rollItemMacro("${data.uuid}");`;
  let macro = game.macros.find(m => (m.name === item.name) && (m.command === command));
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: "script",
      img: item.img,
      command: command,
      flags: { "novatide.itemMacro": true }
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemUuid
 */
function rollItemMacro(itemUuid) {
  // Reconstruct the drop data so that we can load the item.
  const dropData = {
    type: 'Item',
    uuid: itemUuid
  };
  // Load the item from the uuid.
  Item.fromDropData(dropData).then(item => {
    // Determine if the item loaded and if it's an owned item.
    if (!item || !item.parent) {
      const itemName = item?.name ?? itemUuid;
      return ui.notifications.warn(`Could not find item ${itemName}. You may need to delete and recreate this macro.`);
    }

    // Trigger the item roll
    item.roll();
  });
}