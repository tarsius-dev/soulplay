/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RatingDistribution {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface TitleRatingSummary {
  titleId: string;
  averageScore: number;
  totalRatings: number;
  distribution: RatingDistribution;
  userRating?: number | null;
}

const STORAGE_KEY_USER_RATINGS = 'seoulplay_user_ratings_v1';
const STORAGE_KEY_AGGREGATES = 'seoulplay_aggregate_ratings_v1';

// Pre-seeded base ratings for realistic community engagement
const BASE_AGGREGATES: Record<string, RatingDistribution> = {
  // Queen of the Chaebol
  '22222222-0000-0000-0000-000000000001': {
    5: 185,
    4: 48,
    3: 10,
    2: 2,
    1: 1,
  },
  // The City of Shadows
  '22222222-0000-0000-0000-000000000002': {
    5: 118,
    4: 52,
    3: 9,
    2: 2,
    1: 1,
  },
  // The Whispers of Gyeongbokgung
  '22222222-0000-0000-0000-000000000003': {
    5: 275,
    4: 31,
    3: 3,
    2: 1,
    1: 0,
  },
  // Coastal Whispers
  '22222222-0000-0000-0000-000000000004': {
    5: 122,
    4: 28,
    3: 4,
    2: 0,
    1: 0,
  },
};

class RatingStore {
  private userRatings: Record<string, number> = {};
  private aggregates: Record<string, RatingDistribution> = {};
  private isClient = false;

  constructor() {
    this.isClient = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    this.loadFromStorage();
  }

  private loadFromStorage() {
    // Clone base distribution
    this.aggregates = JSON.parse(JSON.stringify(BASE_AGGREGATES));

    if (!this.isClient) return;

    try {
      const savedUser = window.localStorage.getItem(STORAGE_KEY_USER_RATINGS);
      if (savedUser) {
        this.userRatings = JSON.parse(savedUser);
      }

      const savedAgg = window.localStorage.getItem(STORAGE_KEY_AGGREGATES);
      if (savedAgg) {
        const parsed = JSON.parse(savedAgg);
        this.aggregates = { ...this.aggregates, ...parsed };
      }
    } catch {
      // Fallback silently if storage unavailable
    }
  }

  private saveToStorage() {
    if (!this.isClient) return;
    try {
      window.localStorage.setItem(STORAGE_KEY_USER_RATINGS, JSON.stringify(this.userRatings));
      window.localStorage.setItem(STORAGE_KEY_AGGREGATES, JSON.stringify(this.aggregates));
    } catch {
      // Ignore quota errors
    }
  }

  private notify(titleId: string) {
    if (this.isClient) {
      window.dispatchEvent(
        new CustomEvent('seoulplay:rating_updated', {
          detail: { titleId },
        })
      );
    }
  }

  public getDistribution(titleId: string): RatingDistribution {
    if (!this.aggregates[titleId]) {
      this.aggregates[titleId] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    }
    return { ...this.aggregates[titleId] };
  }

  public getSummary(titleId: string): TitleRatingSummary {
    const dist = this.getDistribution(titleId);
    const totalRatings = dist[1] + dist[2] + dist[3] + dist[4] + dist[5];
    const totalWeightedScore =
      dist[1] * 1 + dist[2] * 2 + dist[3] * 3 + dist[4] * 4 + dist[5] * 5;

    const averageScore =
      totalRatings > 0
        ? Math.round((totalWeightedScore / totalRatings) * 10) / 10
        : 0;

    const userRating = this.userRatings[titleId] || null;

    return {
      titleId,
      averageScore,
      totalRatings,
      distribution: dist,
      userRating,
    };
  }

  public rateTitle(titleId: string, score: number): TitleRatingSummary {
    const clampedScore = Math.min(5, Math.max(1, Math.round(score))) as 1 | 2 | 3 | 4 | 5;
    const existingUserScore = this.userRatings[titleId];
    const dist = this.getDistribution(titleId);

    if (existingUserScore) {
      // Decrement prior vote
      if (dist[existingUserScore as 1 | 2 | 3 | 4 | 5] > 0) {
        dist[existingUserScore as 1 | 2 | 3 | 4 | 5]--;
      }
    }

    // Increment new vote
    dist[clampedScore]++;
    this.aggregates[titleId] = dist;
    this.userRatings[titleId] = clampedScore;

    this.saveToStorage();
    this.notify(titleId);

    return this.getSummary(titleId);
  }

  public removeRating(titleId: string): TitleRatingSummary {
    const existingUserScore = this.userRatings[titleId];
    if (existingUserScore) {
      const dist = this.getDistribution(titleId);
      if (dist[existingUserScore as 1 | 2 | 3 | 4 | 5] > 0) {
        dist[existingUserScore as 1 | 2 | 3 | 4 | 5]--;
      }
      delete this.userRatings[titleId];
      this.aggregates[titleId] = dist;

      this.saveToStorage();
      this.notify(titleId);
    }
    return this.getSummary(titleId);
  }

  // Testing helper
  public reset() {
    this.userRatings = {};
    this.aggregates = JSON.parse(JSON.stringify(BASE_AGGREGATES));
    if (this.isClient) {
      window.localStorage.removeItem(STORAGE_KEY_USER_RATINGS);
      window.localStorage.removeItem(STORAGE_KEY_AGGREGATES);
    }
  }
}

export const ratingStore = new RatingStore();
