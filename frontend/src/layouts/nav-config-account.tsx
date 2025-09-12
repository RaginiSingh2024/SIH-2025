import type { AccountDrawerProps } from './components/account-drawer';

import { paths } from 'src/routes/paths';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  blog: icon('ic-blog'),
  blank: icon('ic-blank'),
  file: icon('ic-file'),
  dashboard: icon('ic-dashboard'),
};

// ----------------------------------------------------------------------

export const _account: AccountDrawerProps['data'] = [
  { label: 'Dashboard', href: paths.main.dashboard, icon: ICONS.dashboard },
  { label: 'Profile', href: paths.main.profile, icon: ICONS.dashboard },
  { label: 'Documents', href: paths.main.documents, icon: ICONS.file },
  { label: 'Quiz', href: paths.main.quiz, icon: ICONS.blog },
  { label: 'Flashcards', href: paths.main.flashcards, icon: ICONS.blank },
  { label: 'Syllabus', href: paths.main.syllabus, icon: ICONS.file },
  { label: 'Learning Path', href: paths.main.learningPath, icon: ICONS.dashboard },
  { label: 'Counselling', href: paths.main.counselling, icon: ICONS.blog },
  { label: 'Chat', href: paths.main.chat, icon: ICONS.blog },
];
