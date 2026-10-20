import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SketchFrame } from './SketchFrame.tsx';

describe('SketchFrame', () => {
  it('renders its content above a stretchable, non-scaling outline', () => {
    const { container } = render(<SketchFrame>בדיקה</SketchFrame>);
    expect(screen.getByText('בדיקה')).toBeTruthy();

    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('preserveAspectRatio')).toBe('none');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(container.querySelector('path')?.getAttribute('vector-effect')).toBe('non-scaling-stroke');
  });

  it('applies the dashed style only to the dashed variant', () => {
    const solid = render(<SketchFrame>א</SketchFrame>).container.querySelector('svg')!;
    const dashed = render(<SketchFrame variant="dashed">ב</SketchFrame>).container.querySelector('svg')!;
    expect(dashed.getAttribute('class')).not.toBe(solid.getAttribute('class'));
  });
});
