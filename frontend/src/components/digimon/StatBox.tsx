import React from "react";
import { View, Text } from "react-native";
import { styles } from "./Styles";

interface Props {
  label: string;
  value: number;
  color: string;
  level: number;
}

export default function StatBox({
  label,
  value,
  color,
  level,
}: Props) {
  return (
    <View style={styles.stat}>
      <Text style={{ fontSize: 12, color }}>
        {label}
      </Text>

      <Text style={styles.statValue}>
        {value + 2 * level}
      </Text>
    </View>
  );
}