import type { LucideIcon } from 'lucide-react';
import { BookOpen, Car, Compass, GraduationCap, LayoutGrid, RotateCcw } from 'lucide-react';

export type View = 'today' | 'learn' | 'practice' | 'garage' | 'dictionary' | 'progress';
export const nav: { id: View; label: string; icon: LucideIcon }[] = [
  { id: 'today', label: 'Today', icon: Compass },
  { id: 'learn', label: 'Courses', icon: BookOpen },
  { id: 'practice', label: 'Practice', icon: RotateCcw },
  { id: 'garage', label: 'Car library', icon: Car },
  { id: 'dictionary', label: 'Car dictionary', icon: GraduationCap },
  { id: 'progress', label: 'Your progress', icon: LayoutGrid },
];
