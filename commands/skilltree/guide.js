const Page = require("../../objects/page");
const {createLargeSwipePanel} = require("../../modules/createSwipePanel");

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
      new Page("Setup", "To use Skill Tree, you must first create an account (don't worry, this will be automatically bound to your discordID) \n" +
      "It allows you to add details that optimizes your skill tree experience \n" +
      "If you think you have made a mistake, you can edit your settings using the `~settings` command"  
      ),
      new Page("Skills", "Skills are organised into increasing levels of difficulty, they represent real skills that you can learn and master. You'll need to complete all the required skills in order to start a later one, progressively overloading your willpower"),
      new Page("Ranks and XP", "XP points are the foundational metric that are the basis of your level,character design and progress in skill tree \n" + 
      "XP points can be earned by interacting with skill tree, complete tasks within the intended time period to earn the maximum number of points \n" +
      "(note: you do not earn XP points by skipping tasks)" ),
      new Page("Items and Challenges", "Items are a mechanic intended to gamify your Skill Tree experience \n" +
      "Items can either be \n (1) **Skill Items**: they have inherent value (like exclusive videos, PDFs, Guides etc) to help with your self improvement journey \n (2) **Game items**: They are cosmetic elements that can be traded and vary in rarity")
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
