/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { getAdConfig } from '../../src/lib/ads/config';

describe('Advertising Architecture Safety', () => {
  it('strictly disables advertising by default in development', () => {
    const config = getAdConfig();
    expect(config.enabled).toBe(false);
  });
});
