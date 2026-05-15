import React from "react";
import { View, Text } from "react-native";
import { styles } from "./Styles";

interface Props {
  label: string;
  value1: number;
  value2?: number;
  color: string;
  level: number;
}

export default function StatBox2({
  label,
  value1,
  value2 = 0,
  color,
  level,
}: Props) {
  return (
    <View style={styles.stat}>
      <Text style={{ fontSize: 12, color }}>
        {label}
      </Text>

      <Text style={styles.statValue}>
        {value1 + 2 * level} (+{value2})
      </Text>
    </View>
  );
}