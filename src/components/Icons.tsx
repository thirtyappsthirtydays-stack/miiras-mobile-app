import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '../theme';

type IconProps = { size?: number; color?: string };

export function Logo({ size = 26, color = colors.navy }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" accessibilityElementsHidden importantForAccessibility="no">
      <Path d="M28 100 V70 a16 16 0 0 1 32 0 V100" fill="none" stroke={color} strokeWidth={14} strokeLinecap="round" />
      <Path d="M60 100 V58 a16 16 0 0 1 32 0 V100" fill="none" stroke={color} strokeWidth={14} strokeLinecap="round" />
      <Circle cx={44} cy={32} r={8} fill={color} />
      <Circle cx={76} cy={20} r={8} fill={colors.gold} />
    </Svg>
  );
}

export function BackIcon({ size = 20, color = colors.navy }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M15 5l-7 7 7 7" />
    </Svg>
  );
}

export function UndoIcon({ size = 18, color = colors.navy }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 14l-5-5 5-5" />
      <Path d="M4 9h11a5 5 0 0 1 0 10h-3" />
    </Svg>
  );
}

export function ChevronIcon({ size = 20, color = colors.navy }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 5l7 7-7 7" />
    </Svg>
  );
}

export function InfoIcon({ size = 20, color = colors.navy }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={12} cy={12} r={9} />
      <Path d="M12 11v5" />
      <Rect x={11.2} y={7.2} width={1.6} height={1.6} rx={0.8} fill={color} stroke="none" />
    </Svg>
  );
}

export function ListIcon({ size = 18, color = colors.navy }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round">
      <Path d="M9 6h11M9 12h11M9 18h11" />
      <Path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01" strokeWidth={2.6} />
    </Svg>
  );
}

export function LockIcon({ size = 22, color = colors.goldText }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Rect x={5} y={11} width={14} height={10} rx={2} />
      <Path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </Svg>
  );
}

export function TipIcon({ size = 16, color = colors.navy }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 18h6M10 21h4" />
      <Path d="M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z" />
    </Svg>
  );
}

export function CheckIcon({ size = 18, color = colors.cream }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 12.5l4.5 4.5L19 7" />
    </Svg>
  );
}
