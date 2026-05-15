import React from "react";
import { View, Text } from "react-native";
import { styles } from "./Styles";

interface Skill {
  id_skill: number;
  name: string;
  type: string;
  element: string;
  description: string;
  MP_Cost: number;
  learning: string;
}

interface Props {
  skills?: Skill[];
}

export default function DigimonSkills({ skills }: Props) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>
        ◆ Skills
      </Text>

      {skills?.length ? (
        skills.map((skill, i) => (
          <View key={i} style={styles.skillCard}>

            <View style={styles.skillHeader}>
              <Text style={styles.skillName}>
                {skill.name}
              </Text>

              <Text style={styles.skillMp}>
                {skill.MP_Cost} MP
              </Text>
            </View>

            <Text style={styles.skillSubtitle}>
              {skill.element} • {skill.type}
            </Text>

            <Text style={styles.skillLearning}>
              Learned: {skill.learning}
            </Text>

            <Text style={styles.skillDescription}>
              {skill.description}
            </Text>

          </View>
        ))
      ) : (
        <Text style={{ color: "#fff", fontSize: 12 }}>
          No skills yet
        </Text>
      )}
    </View>
  );
}