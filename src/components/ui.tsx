import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, fonts } from '../theme';

export function tap() {
  Haptics.selectionAsync().catch(() => {});
}

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  style?: ViewStyle;
};

export function Button({ label, onPress, variant = 'primary', style }: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        isPrimary && styles.primary,
        variant === 'secondary' && styles.secondary,
        isGhost && styles.ghost,
        pressed && { opacity: 0.8 },
        style,
      ]}
    >
      <Text style={[styles.buttonText, isPrimary && { color: colors.cream }]}>{label}</Text>
    </Pressable>
  );
}

export function IconButton({ label, onPress, children, disabled }: { label: string; onPress: () => void; children: ReactNode; disabled?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={6}
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [styles.iconButton, disabled && { opacity: 0.35 }, pressed && { opacity: 0.7 }]}
    >
      {children}
    </Pressable>
  );
}

export function Eyebrow({ children, color = colors.muted }: { children: ReactNode; color?: string }) {
  return <Text style={[styles.eyebrow, { color }]}>{children}</Text>;
}

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    borderRadius: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: colors.navy },
  secondary: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderStrong },
  ghost: { minHeight: 44, backgroundColor: 'transparent' },
  buttonText: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.navy },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: { fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  card: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 18 },
});
