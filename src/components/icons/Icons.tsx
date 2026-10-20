import type { SVGProps } from 'react';

// Chalk-style line icons: no fill, rounded strokes, slightly wobbly lines, colored by currentColor.
type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.2 11.1 L12.1 3.4 L20.9 11.2" />
      <path d="M5.4 9.6 Q5.2 15 5.5 20.3 Q12 20.6 18.6 20.2 Q18.8 15 18.5 9.5" />
      <path d="M10 20.2 Q9.8 17 10.1 14.4 Q12 14.2 14 14.5 Q14.2 17 13.9 20.2" />
    </Icon>
  );
}

export function PencilIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M15.6 4.3 Q17.6 3.4 19.6 5.4 Q20.6 7.4 19.7 8.4 L8.6 19.4 L3.9 20.2 L4.6 15.4 Z" />
      <path d="M13.9 6.1 L17.9 10.1" />
    </Icon>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3.1 Q20.8 3.3 20.9 12 Q20.7 20.8 12 20.9 Q3.2 20.7 3.1 12 Q3.3 3.2 12 3.1 Z" />
      <path d="M12.1 11 Q11.9 13.8 12 16.6" />
      <path d="M12 7.6 L12.05 7.7" strokeWidth="2.8" />
    </Icon>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6.2 9.3 Q9.2 12.2 12 15 Q14.9 12.1 17.8 9.2" />
    </Icon>
  );
}
