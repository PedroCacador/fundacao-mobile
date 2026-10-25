import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  ArrowRight,
  BadgePercent,
  Bell,
  Briefcase,
  Building,
  Bus,
  Calendar,
  CalendarCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Clock,
  Coins,
  Construction,
  CreditCard,
  Dumbbell,
  Eye,
  EyeOff,
  FileText,
  Gift,
  Glasses,
  Globe,
  GraduationCap,
  Heart,
  HeartPulse,
  History,
  House,
  IdCard,
  Info,
  KeyRound,
  Lock,
  LogOut,
  LucideIcon,
  Mail,
  MapPin,
  Megaphone,
  Phone,
  Pill,
  Search,
  Settings,
  Store,
  Tag,
  Ticket,
  User,
  Utensils,
  Wallet,
  X,
} from 'lucide-react-native';
import { NomeIcone } from '../../models/Icon';
import { cores, raio } from '../../theme';

export type { NomeIcone };

const icones: Record<NomeIcone, LucideIcon> = {
  'arrow-right': ArrowRight,
  'badge-percent': BadgePercent,
  bell: Bell,
  briefcase: Briefcase,
  building: Building,
  bus: Bus,
  calendar: Calendar,
  'calendar-check': CalendarCheck,
  check: Check,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'circle-alert': CircleAlert,
  'circle-check': CircleCheck,
  clock: Clock,
  coins: Coins,
  construction: Construction,
  'credit-card': CreditCard,
  dumbbell: Dumbbell,
  eye: Eye,
  'eye-off': EyeOff,
  'file-text': FileText,
  gift: Gift,
  glasses: Glasses,
  globe: Globe,
  'graduation-cap': GraduationCap,
  heart: Heart,
  'heart-pulse': HeartPulse,
  history: History,
  house: House,
  'id-card': IdCard,
  info: Info,
  'key-round': KeyRound,
  lock: Lock,
  'log-out': LogOut,
  mail: Mail,
  'map-pin': MapPin,
  megaphone: Megaphone,
  phone: Phone,
  pill: Pill,
  search: Search,
  settings: Settings,
  store: Store,
  tag: Tag,
  ticket: Ticket,
  user: User,
  utensils: Utensils,
  wallet: Wallet,
  x: X,
};

interface IconeProps {
  nome: NomeIcone;
  tamanho?: number;
  cor?: string;
  espessura?: number;
}

export function Icone({ nome, tamanho = 20, cor = cores.texto, espessura = 1.75 }: IconeProps) {
  const Componente = icones[nome];
  return <Componente size={tamanho} color={cor} strokeWidth={espessura} style={styles.icone} />;
}

interface IconBoxProps {
  nome: NomeIcone;
  cor?: string;
  fundo?: string;
  tamanho?: number;
  redondo?: boolean;
}

export function IconBox({
  nome,
  cor = cores.primaria,
  fundo = cores.primariaClara,
  tamanho = 44,
  redondo = false,
}: IconBoxProps) {
  return (
    <View
      style={[
        styles.caixa,
        {
          width: tamanho,
          height: tamanho,
          backgroundColor: fundo,
          borderRadius: redondo ? tamanho / 2 : Math.max(raio.md, tamanho * 0.26),
        },
      ]}
    >
      <Icone nome={nome} tamanho={Math.round(tamanho * 0.5)} cor={cor} />
    </View>
  );
}

const styles = StyleSheet.create({
  icone: {
    flexShrink: 0,
  },
  caixa: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
