import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

interface Props {
  gender?: string;
  size?: number;
  role?: string;
  imageUrl?: string;
}

export default function GenderAvatar({ gender, size = 44, role, imageUrl }: Props) {
  const g = (gender || '').toLowerCase();
  const isFemale = g === 'female' || g === 'f' || g === 'girl';
  const isMale = g === 'male' || g === 'm' || g === 'boy';

  let bgColor = COLORS.primaryLavender;
  let iconColor = COLORS.primary;
  let iconName: any = 'person';

  if (isFemale) {
    bgColor = '#FFE0EF';
    iconColor = '#D63384';
    iconName = 'woman';
  } else if (isMale) {
    bgColor = '#DDE8FF';
    iconColor = '#3D6FD6';
    iconName = 'man';
  } else if (role === 'admin') {
    bgColor = COLORS.primary;
    iconColor = '#fff';
    iconName = 'shield-checkmark';
  }

  if (imageUrl && imageUrl.startsWith('http')) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}
        defaultSource={undefined}
      />
    );
  }

  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2, backgroundColor: bgColor }]}>
      <Ionicons name={iconName} size={size * 0.55} color={iconColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

