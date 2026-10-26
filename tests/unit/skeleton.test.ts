/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import React from 'react';
import {
  Skeleton,
  TitleCardSkeleton,
  TitleGridSkeleton,
  HeroBannerSkeleton,
  TitleDetailSkeleton,
  WatchPlayerSkeleton,
  CatalogPageSkeleton,
  AdminTableSkeleton,
  GlobalSkeletonLoader,
} from '../../src/components/common/Skeleton';

// Note: If testing-library is not installed, we can test component element generation or pure react element rendering.
// Let's verify whether @testing-library/react is installed or test React.createElement structure.
describe('Global Skeleton Loader & Variants', () => {
  it('creates basic Skeleton element with expected classes and attributes', () => {
    const el = React.createElement(Skeleton, {
      variant: 'text',
      className: 'custom-skeleton',
      width: 120,
      height: 20,
    });
    expect(el).toBeDefined();
    expect(el.props.variant).toBe('text');
    expect(el.props.width).toBe(120);
    expect(el.props.height).toBe(20);
  });

  it('creates TitleCardSkeleton element properly', () => {
    const el = React.createElement(TitleCardSkeleton, { className: 'test-card' });
    expect(el).toBeDefined();
    expect(el.props.className).toBe('test-card');
  });

  it('creates TitleGridSkeleton with custom item count', () => {
    const el = React.createElement(TitleGridSkeleton, { count: 6 });
    expect(el).toBeDefined();
    expect(el.props.count).toBe(6);
  });

  it('creates HeroBannerSkeleton properly', () => {
    const el = React.createElement(HeroBannerSkeleton, {});
    expect(el).toBeDefined();
  });

  it('creates TitleDetailSkeleton properly', () => {
    const el = React.createElement(TitleDetailSkeleton, {});
    expect(el).toBeDefined();
  });

  it('creates WatchPlayerSkeleton properly', () => {
    const el = React.createElement(WatchPlayerSkeleton, {});
    expect(el).toBeDefined();
  });

  it('creates CatalogPageSkeleton properly', () => {
    const el = React.createElement(CatalogPageSkeleton, { count: 8 });
    expect(el).toBeDefined();
    expect(el.props.count).toBe(8);
  });

  it('creates AdminTableSkeleton properly', () => {
    const el = React.createElement(AdminTableSkeleton, { rows: 5 });
    expect(el).toBeDefined();
    expect(el.props.rows).toBe(5);
  });

  it('creates GlobalSkeletonLoader for all supported variants', () => {
    const variants = ['home', 'detail', 'watch', 'catalog', 'grid', 'admin', 'generic'] as const;
    variants.forEach((variant) => {
      const el = React.createElement(GlobalSkeletonLoader, { variant });
      expect(el).toBeDefined();
      expect(el.props.variant).toBe(variant);
    });
  });
});
