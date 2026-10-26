/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ratingStore } from '../../src/lib/rating/store';

describe('Rating Store & Calculation Engine', () => {
  beforeEach(() => {
    ratingStore.reset();
  });

  it('retrieves baseline ratings correctly for seeded titles', () => {
    const summary = ratingStore.getSummary('22222222-0000-0000-0000-000000000001');
    expect(summary.totalRatings).toBeGreaterThan(0);
    expect(summary.averageScore).toBeGreaterThanOrEqual(4.5);
    expect(summary.averageScore).toBeLessThanOrEqual(5.0);
    expect(summary.userRating).toBeNull();
  });

  it('returns clean zero state for brand new unrated titles', () => {
    const summary = ratingStore.getSummary('custom-new-title-uuid');
    expect(summary.totalRatings).toBe(0);
    expect(summary.averageScore).toBe(0);
    expect(summary.userRating).toBeNull();
    expect(summary.distribution[5]).toBe(0);
  });

  it('records user rating and updates aggregate distribution and average score', () => {
    const titleId = 'custom-test-title';
    // User rates 5 stars
    const updated = ratingStore.rateTitle(titleId, 5);
    expect(updated.totalRatings).toBe(1);
    expect(updated.averageScore).toBe(5);
    expect(updated.userRating).toBe(5);
    expect(updated.distribution[5]).toBe(1);
  });

  it('allows user to change their rating without inflating total count', () => {
    const titleId = 'custom-test-title-2';
    // First rating: 1 star
    ratingStore.rateTitle(titleId, 1);
    let summary = ratingStore.getSummary(titleId);
    expect(summary.totalRatings).toBe(1);
    expect(summary.averageScore).toBe(1);
    expect(summary.distribution[1]).toBe(1);
    expect(summary.distribution[5]).toBe(0);

    // User updates their mind to 5 stars
    summary = ratingStore.rateTitle(titleId, 5);
    expect(summary.totalRatings).toBe(1); // count should stay 1
    expect(summary.averageScore).toBe(5);
    expect(summary.distribution[1]).toBe(0);
    expect(summary.distribution[5]).toBe(1);
    expect(summary.userRating).toBe(5);
  });

  it('clamps invalid ratings between 1 and 5', () => {
    const titleId = 'clamp-test';
    ratingStore.rateTitle(titleId, 10);
    expect(ratingStore.getSummary(titleId).userRating).toBe(5);

    ratingStore.rateTitle(titleId, -3);
    expect(ratingStore.getSummary(titleId).userRating).toBe(1);
  });

  it('allows user to remove/retract their rating', () => {
    const titleId = 'retract-test';
    ratingStore.rateTitle(titleId, 4);
    expect(ratingStore.getSummary(titleId).totalRatings).toBe(1);

    const retracted = ratingStore.removeRating(titleId);
    expect(retracted.totalRatings).toBe(0);
    expect(retracted.userRating).toBeNull();
    expect(retracted.averageScore).toBe(0);
  });
});
