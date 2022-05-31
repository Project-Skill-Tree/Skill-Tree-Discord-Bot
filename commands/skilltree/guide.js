const Page = require("../../objects/page");
const {createLargeSwipePanel} = require("../../modules/menuHelper");

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
  const pages = getPages();

  //Create swipeable menu
  createLargeSwipePanel(client, message.author, message.channel, pages);
};

function getPages() {
  return [
    new Page("Skill Tree",
      "The Skill Tree gamifies self-improvement with real-life skills, " +
      "challenges, items, XP, levels, and more. Like a video game skill tree, you " +
      "start from one single skill, unlocking new paths as you progress in your " +
      "self-improvement journey. It's a massively multiplayer online habit tracker, " +
      "designed so that you can consistently and efficiently progressively overload your habits, " +
      "without being overwhelmed with knowledge"),
    new Page("Skill Tree",
      "The Skill Tree gamifies self-improvement with real-life skills, " +
      "challenges, items, XP, levels, and more. Like a video game skill tree, you " +
      "start from one single skill, unlocking new paths as you progress in your " +
      "self-improvement journey. It's a massively multiplayer online habit tracker, " +
      "designed so that you can consistently and efficiently progressively overload your habits, " +
      "without being overwhelmed with knowledge"),
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
