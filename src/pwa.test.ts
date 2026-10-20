import { describe, expect, it } from 'vitest';

// Keys are the icon file paths that actually exist in public/icons
const found = Object.keys(import.meta.glob('../public/icons/*.png')).map((p) => p.split('/').pop());

const icons = [
  'icon-192.png',
  'icon-512.png',
  'icon-512-maskable.png',
  'apple-touch-icon.png',
  'favicon-32.png',
];

describe('PWA icons', () => {
  it.each(icons)('%s exists in public/icons', (name) => {
    expect(found).toContain(name);
  });
});
