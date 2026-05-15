var DataTypes = require("sequelize").DataTypes;
var _campaign = require("./campaign");
var _code_shard = require("./code_shard");
var _digimon_evolution= require("./digimon_evolution");
var _digimon_skill = require("./digimon_skill");
var _digimon = require("./digimon");
var _family = require("./family");
var _human = require("./human");
var _npc = require("./npc");
var _other_digimon = require("./other_digimon");
var _partner_digimon = require("./partner_digimon");
var _reward = require("./reward");
var _session = require("./session");
var _skill = require("./skill");
var _user_campaign = require("./user_campaign");
var _user = require("./user");

function initModels(sequelize) {
  var campaign = _campaign(sequelize, DataTypes);
  var code_shard = _code_shard(sequelize, DataTypes);
  var digimon_evolution = _digimon_evolution(sequelize, DataTypes);
  var digimon_skill = _digimon_skill(sequelize, DataTypes);
  var digimon = _digimon(sequelize, DataTypes);
  var family = _family(sequelize, DataTypes);
  var human = _human(sequelize, DataTypes);
  var npc = _npc(sequelize, DataTypes);
  var other_digimon = _other_digimon(sequelize, DataTypes);
  var partner_digimon = _partner_digimon(sequelize, DataTypes);
  var reward = _reward(sequelize, DataTypes);
  var session = _session(sequelize, DataTypes);
  var skill = _skill(sequelize, DataTypes);
  var user_campaign = _user_campaign(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

    //User-Campaign Associations
    user.belongsToMany(campaign, { through: user_campaign, foreignKey: "id_user", otherKey: "id_campaign" });
    campaign.belongsToMany(user, { through: user_campaign, foreignKey: "id_campaign", otherKey: "id_user" });
    user_campaign.belongsTo(campaign, { foreignKey: "id_campaign" });
    campaign.hasMany(user_campaign, { foreignKey: "id_campaign" });
    user_campaign.belongsTo(user, { foreignKey: "id_user" });
    user.hasMany(user_campaign, { foreignKey: "id_user" });

    //User-Campaign-Other Associations
    user_campaign.hasMany(code_shard, { foreignKey: "id_uc" });
    code_shard.belongsTo(user_campaign, { foreignKey: "id_uc" });
    user_campaign.hasMany(partner_digimon, { foreignKey: "partner_digimon" });
    partner_digimon.belongsTo(user_campaign, { foreignKey: "partner_digimon" });
    user_campaign.hasMany(human, { foreignKey: "human_sheet" });
    human.belongsTo(user_campaign, { foreignKey: "human_sheet" });

    //Campaign-Other Associations
    campaign.hasMany(session, { foreignKey: "id_campaign" });
    session.belongsTo(campaign, { foreignKey: "id_campaign" });
    campaign.hasMany(npc, { foreignKey: "id_campaign" });
    npc.belongsTo(campaign, { foreignKey: "id_campaign" });

    //Digimon-Other Associations
    digimon.hasMany(digimon_skill, { foreignKey: "id_digimon" });
    digimon_skill.belongsTo(digimon, { foreignKey: "id_digimon" });
    digimon.hasMany(digimon_evolution, { foreignKey: "base_digimon_id" });
    digimon_evolution.belongsTo(digimon, { foreignKey: "base_digimon_id" });
    digimon.hasMany(digimon_evolution, { foreignKey: "new_digimon_id" });
    digimon_evolution.belongsTo(digimon, { foreignKey: "new_digimon_id" });
    digimon.hasMany(other_digimon, { foreignKey: "id_digimon" });
    other_digimon.belongsTo(digimon, { foreignKey: "id_digimon" });
    digimon.hasMany(partner_digimon, { foreignKey: "id_digimon" });
    partner_digimon.belongsTo(digimon, { foreignKey: "id_digimon" });
    digimon.belongsTo(family, { foreignKey: "family_tree" });
    family.hasMany(digimon, { foreignKey: "family_tree" });

    //Skill-Other Associations
    skill.hasMany(digimon_skill, { foreignKey: "id_skill" });
    digimon_skill.belongsTo(skill, { foreignKey: "id_skill" });
   
    //NPC-Other Associations
    npc.hasMany(human, { foreignKey: "id_human" });
    human.belongsTo(npc, { foreignKey: "id_human" });
    npc.hasMany(other_digimon, { foreignKey: "id_digimon" });
    other_digimon.belongsTo(npc, { foreignKey: "id_digimon" });

    //User-Character Associations
    user.hasMany(partner_digimon, { foreignKey: "id_user" });
    partner_digimon.belongsTo(user, { foreignKey: "id_user" });
    user.hasMany(human, { foreignKey: "id_user" });
    human.belongsTo(user, { foreignKey: "id_user" });
    

    return {
    campaign,
    code_shard,
    digimon_evolution,
    digimon_skill,
    digimon,
    family,
    human,
    npc,
    other_digimon,
    partner_digimon,
    reward,
    session,
    skill,
    user_campaign,
    user
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
