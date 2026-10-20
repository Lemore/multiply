import type { ComponentType } from 'react';
import type { Screen } from '../../game/types.ts';
import { strings } from '../../strings/he.ts';
import { HomeIcon, InfoIcon, PencilIcon } from '../icons/Icons.tsx';
import styles from './BottomNav.module.css';

type BottomNavProps = {
  current: Screen;
  onNavigate: (screen: Screen) => void;
};

// DOM order is home → learn → about; dir="rtl" places "home" on the right.
const items: { screen: Screen; label: string; Icon: ComponentType }[] = [
  { screen: 'home', label: strings.nav.home, Icon: HomeIcon },
  { screen: 'learn', label: strings.nav.learn, Icon: PencilIcon },
  { screen: 'about', label: strings.nav.about, Icon: InfoIcon },
];

export function BottomNav({ current, onNavigate }: BottomNavProps) {
  return (
    <nav className={styles.nav} aria-label={strings.nav.ariaLabel}>
      <div className={styles.items}>
        {items.map(({ screen, label, Icon }) => {
          const active = screen === current;
          return (
            <button
              key={screen}
              type="button"
              className={[styles.item, active ? styles.active : ''].join(' ')}
              aria-current={active ? 'page' : undefined}
              onClick={() => onNavigate(screen)}
            >
              <Icon />
              <span className={styles.label}>{label}</span>
              {active && (
                <svg className={styles.underline} viewBox="0 0 40 6" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M2 3.4 Q10 2.2 20 3 T38 2.8" vectorEffect="non-scaling-stroke" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
