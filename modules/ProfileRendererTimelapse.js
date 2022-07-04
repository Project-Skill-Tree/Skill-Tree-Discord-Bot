const fs = require("fs");
const {getProfileImage} = require("./profileRenderer");

/**
 * Sends an embedded profile summary, including level, character, xp, badges, items, skills, etc.
 * @param user - Skill tree user object
 */
exports.saveProfile = async function(user, i) {
  const profile = await getProfileImage(user);
  const out = fs.createWriteStream(`../images/${i}.png`);
  out.write(profile);
};
