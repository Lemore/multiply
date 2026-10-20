import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MultiplicationTable } from './MultiplicationTable.tsx';

describe('MultiplicationTable', () => {
  it('renders 100 correct products in an LTR table with header cells', () => {
    const { container } = render(<MultiplicationTable />);
    const table = container.querySelector('table')!;
    expect(table.getAttribute('dir')).toBe('ltr');

    expect(table.querySelectorAll('th[scope="col"]')).toHaveLength(11); // corner + 1–10
    expect(table.querySelectorAll('th[scope="row"]')).toHaveLength(10);

    const rows = table.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(10);
    rows.forEach((row, r) => {
      expect(row.querySelector('th')!.textContent).toBe(String(r + 1));
      const cells = row.querySelectorAll('td');
      expect(cells).toHaveLength(10);
      cells.forEach((cell, c) => expect(cell.textContent).toBe(String((r + 1) * (c + 1))));
    });
  });
});
