import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Unmount rendered components between tests (auto-cleanup needs Vitest globals, which are off).
afterEach(cleanup);
