const XPHelper = require("../../modules/XPHelper");
const User = require("../../objects/user");
const Skill = require("../../objects/skill");
const {saveProfile} = require("../../modules/ProfileRendererTimelapse");

exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const sip = [3,2,4];
  for (let i = 0; i < 100; i++) {
    const skills = [];
    if (i >= 54) {
      skills.push(new Skill(0, "MEDITATION", 7,"","",0,"",0,0, "meditation.png", []));
    } if (i >= 52) {
      skills.push(new Skill(0,"MEDITATION", 6,"","",0,"",0,0, "meditation.png", []));
    } if (i >= 38) {
      skills.push(new Skill(0,"READING", 5,"","",0,"",0,0, "meditation.png", []));
    } if (i >= 15) {
      skills.push(new Skill(0,"READING", 4,"","",0,"",0,0, "meditation.png", []));
    } if (i >= 2) {
      skills.push(new Skill(0,"READING", 3,"","",0,"",0,0, "meditation.png", []));
    } if (i >= 1) {
      skills.push(new Skill(0,"READING", 2,"","",0,"",0,0, "meditation.png", []));
    }

    if (i >= 60) {
      skills.push(new Skill(0, "READING", 6,"","",0,"",0,0,"reading.png", []));
    } if (i >= 27) {
      skills.push(new Skill(0, "MEDITATION", 4,"","",0,"",0,0,"reading.png", []));
    } if (i >= 5) {
      skills.push(new Skill(0, "READING", 2,"","",0,"",0,0,"reading.png", []));
    } if (i >= 3) {
      skills.push(new Skill(0, "READING", 1,"","",0,"",0,0,"reading.png", []));
    }

    if (i >= 46) {
      skills.push(new Skill(0,"brain", 4,"","",0,"",0,0, "stoicism.png", []));
    } if (i >= 41) {
      skills.push(new Skill(0, "brain", 3,"","",0,"",0,0, "stoicism.png", []));
    } if (i >= 12) {
      skills.push(new Skill(0, "READING", 2,"","",0,"",0,0, "stoicism.png", []));
    } if (i >= 8) {
      skills.push(new Skill(0, "READING", 1,"","",0,"",0,0, "stoicism.png", []));
    }

    if (i >= 35) {
      skills.push(new Skill(0, "READING", 6,"","",0,"",0,0,"fitness.png", []));
    } if (i >= 31) {
      skills.push(new Skill(0, "READING", 4,"","",0,"",0,0,"fitness.png", []));
    } if (i >= 28) {
      skills.push(new Skill(0, "READING", 3,"","",0,"",0,0,"fitness.png", []));
    } if (i >= 23) {
      skills.push(new Skill(0, "READING", 2,"","",0,"",0,0,"fitness.png", []));
    }

    if (Math.random() > 0.5 && sip.length < 6) {
      sip.push(5);
    }

    if (Math.random() > 0.5 && sip.length > 0) {
      sip.pop();
    }

    const user = new User(0, 0,"Player",
      XPHelper.calcXPFromLevel(i) + Math.floor((i/100)*XPHelper.calcXPToLevelUp(i)),[], skills, Array(sip.length).fill(2),
      [], i*3, "","","");
    saveProfile(user, i);
  }
  //});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Owner"
};

exports.help = {
  name: "profiletimelapse",
  category: "Skill Tree",
  description: "Displays your character profile, XP, level, badges and more",
  usage: "profile"
};
