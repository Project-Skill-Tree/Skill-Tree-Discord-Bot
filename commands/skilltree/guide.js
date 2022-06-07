const Page = require("../../objects/page");
const {createLargeSwipePanel} = require("../../modules/menuHelper");
const {imageToBuffer} = require("../../modules/UIHelper");
const {getBadgeIcon} = require("../../objects/badge");

/**
 * The guide command displays 5 pages of instructions for how to use the bot.
 * The guide uses arrows to navigate the guide menu
 * Page 1: Skill Tree
 * Page 2: Setup and creating your account
 * Page 3: Skills
 * Page 4: Ranks and XP
 * Page 5: Items and Challenges
 */
exports.run = async (client, message) => {
  //Get pages
  const pages = await getPages(message.settings);

  //Create swipeable menu
  createLargeSwipePanel(client, message.author, message.channel, pages);
};

async function getPages(settings) {
  const skilltreeLogo = await imageToBuffer("skilltree/logo_filled.png", 300);
  const setupLogo = await imageToBuffer("icons/settings.png", 300);
  const badge = await getBadgeIcon("meditation.png", 7, 300);
  const rankIcon = await imageToBuffer("characters/character4.png", 300);
  const challengeIcon = await imageToBuffer("icons/chest.png", 300);
  return [
    new Page("Skill Tree", skilltreeLogo,
      "The Skill Tree gamifies self-improvement with real-life skills, \
      challenges, items, XP, levels, and more. \n\nLike a video game skill tree, you\
      unlock new paths as you progress in your self-improvement journey. It's a competitive habit tracker, designed \
      so that you can consistently and efficiently progressively overload your habits, \
      without being overwhelmed with knowledge"),
    new Page("Setup", setupLogo,
      `To use Skill Tree, you need to create an account with \`${settings.prefix}setup\`, \
      this will automatically be cross compatible with the skill tree app. 
      You need to set a few options to use the skill tree: 
      
      **DIFFICULTY**: Sets difficulty level of your starting skills. You can \
      always change this later with \`${settings.prefix}skip\` to skip or revert skills to match your experience level.
      **GENDER**: \\*Does not\\* affect your progress in the tree, this is purely for your character design.
      **TIMEZONE**: Sets your timezone so that tasks calculate days correctly. \
      Setting it correctly will also ensure that weekly reports are sent at the right time. Use \
      \`${settings.prefix}timezone\` to edit this at any point.
      **BASE LOCATION**: Specify the location where weekly reports and reminders are sent. Use \
      \`${settings.prefix}base\` to edit this at any point.
      
      Note: If you think you have made a mistake, you can edit your settings using \
      the \`${settings.prefix}setup\` command again.
      `),
    new Page("Skills", badge,
      `Skills are organised into increasing levels of difficulty as you progress through the tree.\
      You can start skills if you have unlocked all of the previous ones for that branch. \
      Use the \`${settings.prefix}start\` command to start available skills, or \
      use \`${settings.prefix}skip\` to bypass skills without collecting XP, and \`${settings.prefix}revert\` \
      to go back to old skills. 
      Each skill includes
      
      **NAME**: The name of the skill to be completed e.g. mindfulness.
      **LEVEL**: The level of the skill e.g. 3.
      **GOAL**: The success condition for the skill. e.g. Meditate for 2 minutes.
      **FREQUENCY**: The frequency to practice the skill e.g (DAILY).
      **TIME**: The time you need to keep up the skill to complete it, e.g. 2 weeks. \
      Skills require and 80% completion rate (because life gets in the way).
      **XP**: The amount of XP you will be awarded by completing the skill. 
      
      Note: If the time limit is N/A, the skill must be completed only once \
      and has no time limit. E.g. Plan an activity with family, does not need \
      to be kept up for a week. \nWhen completing a skill, all items/challenges/skills \
      connected to it are unlocked, you can open the links to items, start new skills, \
      and start challenges below it.
      `),
    new Page("Ranks and XP", rankIcon,
      `The XP system is the basis for levelling up and progressing in the skill tree. 
      XP points are earned by completing skills. You can use the \`${settings.prefix}profile\` command to\
      view your character, level, badges, and loads of data about your self-improvement.
      
      Note: you do not earn XP points by skipping tasks`),
    new Page("Items and Challenges", challengeIcon,
      `Items are designed to provide valuable resources to teach you the concepts you need, \
      exactly when you need them, and to gamify your Skill Tree experience.
      
      Items can either be: 
      **Skill Items**: They have inherent value (like exclusive videos, PDFs, Guides etc)\
       to help with your self improvement journey
      **Game items**: They are cosmetic elements that can be traded and vary in rarity
      
      Challenges are... well challenges to test your mental and physical strength. They are one-off events which \
      reward you with a massive amount of XP, but take incredible dedication to complete.`)
  ];
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "guide",
  category: "Skill Tree",
  description: "Guides you through usage of skill-tree.",
  usage: "guide"
};
