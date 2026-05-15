export const getHumanArchetype = (stats) => {
  if (!stats) return "Neutral";

  const {
    courage = 0,
    skill = 0,
    intelligence = 0,
    strength = 0,
    perception = 0,
    serenity = 0,
  } = stats;

  const values = [
    { key: "Courage", value: Number(courage) },
    { key: "Skill", value: Number(skill) },
    { key: "Intelligence", value: Number(intelligence) },
    { key: "Strength", value: Number(strength) },
    { key: "Perception", value: Number(perception) },
    { key: "Serenity", value: Number(serenity) },
  ];

  // orden seguro (por valor + desempate por nombre)
  values.sort((a, b) => {
    if (b.value === a.value) {
      return a.key.localeCompare(b.key);
    }
    return b.value - a.value;
  });

  const primary = values[0].key;
  const secondary = values[1].key;

  // clave estable independiente del orden original
  const pairKey = [primary, secondary]
    .sort((a, b) => a.localeCompare(b))
    .join("+");

  const archetypeMap = {
    "Courage+Intelligence": "Natural Leader",
    "Courage+Serenity": "Strategist",
    "Courage+Strength": "Explorer",
    "Courage+Perception": "Hunter",
    "Courage+Skill": "Fighter",

    "Intelligence+Serenity": "Planner",
    "Intelligence+Strength": "Loner",
    "Intelligence+Perception": "Creator",
    "Intelligence+Skill": "Survivor",

    "Serenity+Strength": "Defender",
    "Perception+Serenity": "Instructor",
    "Serenity+Skill": "Worker",

    "Perception+Strength": "Dreamer",
    "Skill+Strength": "Builder",

    "Perception+Skill": "Artisan",
  };

  return archetypeMap[pairKey] ?? `${primary}-${secondary}`;
};