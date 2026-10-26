/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rect' | 'circle' | 'rounded';
  width?: string | number;
  height?: string | number;
  className?: string;
}

/**
 * Base atomic Skeleton primitive with cinematic dark shimmer animation.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rounded',
  width,
  height,
  className = '',
  style,
  ...rest
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'circle':
        return 'rounded-full';
      case 'text':
        return 'rounded-md h-4 my-1';
      case 'rect':
        return 'rounded-none';
      case 'rounded':
      default:
        return 'rounded-xl';
    }
  };

  return (
    <div
      aria-hidden="true"
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
      className={`skeleton-shimmer border border-slate-800/40 relative overflow-hidden select-none ${getVariantStyles()} ${className}`}
      {...rest}
    />
  );
};

/**
 * Skeleton for a single media title card (matches TitleCard dimensions).
 */
export const TitleCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex flex-col space-y-3 ${className}`}>
      {/* 3:4 Poster Skeleton */}
      <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#141b29] border border-slate-800/80 shadow-md">
        <Skeleton className="w-full h-full rounded-none" />
        <div className="absolute top-2.5 right-2.5 w-10 h-5 rounded-md bg-slate-800/80 border border-slate-700/50" />
      </div>

      {/* Metadata & Title Lines */}
      <div className="space-y-1.5 px-0.5">
        <Skeleton variant="text" className="w-1/3 h-3 bg-slate-800/70" />
        <Skeleton variant="text" className="w-4/5 h-4.5 bg-slate-700/80" />
        <Skeleton variant="text" className="w-1/2 h-3 bg-slate-800/60" />
      </div>
    </div>
  );
};

/**
 * Responsive grid of TitleCardSkeletons.
 */
export const TitleGridSkeleton: React.FC<{ count?: number; className?: string }> = ({
  count = 10,
  className = '',
}) => {
  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 ${className}`}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <TitleCardSkeleton key={`skeleton-card-${idx}`} />
      ))}
    </div>
  );
};

/**
 * Skeleton for the Homepage Cinematic Hero Banner.
 */
export const HeroBannerSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`relative w-full min-h-[460px] lg:min-h-[560px] flex items-end overflow-hidden rounded-2xl bg-[#0f1422] border border-slate-800/80 shadow-2xl p-6 sm:p-10 lg:p-14 mb-12 ${className}`}
    >
      <div className="w-full max-w-2xl space-y-4 z-10">
        {/* Kicker tag */}
        <Skeleton variant="text" className="w-28 h-4 bg-rose-950/40 border-rose-900/30" />
        {/* Giant Title */}
        <Skeleton variant="text" className="w-3/4 sm:w-2/3 h-10 sm:h-12 bg-slate-700/60 rounded-lg" />
        {/* Specs line */}
        <div className="flex items-center gap-3">
          <Skeleton variant="text" className="w-24 h-4 bg-slate-800" />
          <Skeleton variant="text" className="w-16 h-4 bg-slate-800" />
          <Skeleton variant="text" className="w-32 h-4 bg-slate-800" />
        </div>
        {/* Synopsis lines */}
        <div className="space-y-2 pt-2">
          <Skeleton variant="text" className="w-full h-3.5 bg-slate-800/80" />
          <Skeleton variant="text" className="w-5/6 h-3.5 bg-slate-800/80" />
          <Skeleton variant="text" className="w-3/5 h-3.5 bg-slate-800/70" />
        </div>
        {/* CTA buttons */}
        <div className="pt-4 flex items-center gap-4">
          <Skeleton className="w-40 h-12 rounded-xl bg-rose-900/40 border-rose-800/30" />
          <Skeleton className="w-32 h-12 rounded-xl bg-slate-800/70" />
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton for TitleDetailPage (Hero, poster, rating widget, synopsis, episodes).
 */
export const TitleDetailSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`space-y-12 animate-in fade-in duration-300 ${className}`}>
      {/* Back button skeleton */}
      <div className="w-32 h-4 bg-slate-800/60 rounded-md" />

      {/* Hero Section Container */}
      <div className="relative rounded-2xl bg-[#0f1422] border border-slate-800 overflow-hidden p-6 sm:p-10 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
          {/* Poster Skeleton */}
          <div className="w-48 sm:w-56 md:w-64 shrink-0 mx-auto md:mx-0 aspect-[3/4] rounded-xl overflow-hidden bg-[#141b29] border border-slate-800">
            <Skeleton className="w-full h-full rounded-none" />
          </div>

          {/* Details Column */}
          <div className="flex-1 space-y-5 w-full">
            {/* Tag & Kicker */}
            <div className="space-y-2">
              <Skeleton variant="text" className="w-24 h-4 bg-rose-900/30" />
              <Skeleton variant="text" className="w-3/4 h-8 sm:h-10 bg-slate-700/60 rounded-lg" />
              <Skeleton variant="text" className="w-1/3 h-4 bg-slate-800/70" />
            </div>

            {/* Star Rating Widget Skeleton */}
            <div className="py-3 px-4 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-wrap items-center justify-between gap-4 max-w-xl">
              <div className="flex items-center gap-3">
                <Skeleton variant="circle" className="w-10 h-10 bg-slate-800" />
                <div className="space-y-1.5">
                  <Skeleton variant="text" className="w-28 h-4 bg-slate-700" />
                  <Skeleton variant="text" className="w-20 h-3 bg-slate-800" />
                </div>
              </div>
              <Skeleton className="w-32 h-8 rounded-lg bg-slate-800" />
            </div>

            {/* Metadata Badges */}
            <div className="flex flex-wrap gap-2">
              <Skeleton className="w-20 h-7 rounded-lg bg-slate-800" />
              <Skeleton className="w-24 h-7 rounded-lg bg-slate-800" />
              <Skeleton className="w-16 h-7 rounded-lg bg-slate-800" />
            </div>

            {/* Synopsis */}
            <div className="space-y-2 pt-2">
              <Skeleton variant="text" className="w-20 h-3 bg-slate-700" />
              <Skeleton variant="text" className="w-full h-3.5 bg-slate-800" />
              <Skeleton variant="text" className="w-11/12 h-3.5 bg-slate-800" />
              <Skeleton variant="text" className="w-4/5 h-3.5 bg-slate-800" />
            </div>

            {/* Action Bar (Play + Share) */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <Skeleton className="w-48 h-12 rounded-xl bg-rose-900/50" />
              <Skeleton className="w-28 h-12 rounded-xl bg-slate-800" />
            </div>
          </div>
        </div>
      </div>

      {/* Episodes Section Skeleton */}
      <section className="space-y-4">
        <div className="border-b border-slate-800 pb-3 space-y-2">
          <Skeleton variant="text" className="w-56 h-6 bg-slate-700" />
          <Skeleton variant="text" className="w-80 h-3 bg-slate-800" />
        </div>

        {/* Season tab pill and episode cards */}
        <div className="flex gap-2">
          <Skeleton className="w-28 h-9 rounded-lg bg-slate-800" />
          <Skeleton className="w-28 h-9 rounded-lg bg-slate-800/50" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`ep-skeleton-${i}`}
              className="p-4 rounded-xl bg-[#0d121c] border border-slate-800 space-y-2"
            >
              <div className="flex justify-between items-center">
                <Skeleton variant="text" className="w-24 h-4 bg-slate-700" />
                <Skeleton className="w-12 h-4 rounded bg-slate-800" />
              </div>
              <Skeleton variant="text" className="w-full h-3 bg-slate-800/80" />
              <Skeleton variant="text" className="w-3/4 h-3 bg-slate-800/60" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

/**
 * Skeleton for the Video Player (WatchPage).
 */
export const WatchPlayerSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`space-y-8 animate-in fade-in duration-300 ${className}`}>
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton variant="text" className="w-24 h-4 bg-slate-800" />
        <span className="text-slate-700">/</span>
        <Skeleton variant="text" className="w-36 h-4 bg-slate-800" />
        <span className="text-slate-700">/</span>
        <Skeleton variant="text" className="w-20 h-4 bg-slate-800" />
      </div>

      {/* 16:9 Video Player Box */}
      <div className="relative aspect-video w-full rounded-2xl bg-black border border-slate-800/90 shadow-2xl overflow-hidden flex flex-col items-center justify-center p-8">
        <Skeleton className="w-full h-full rounded-none" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
          <Skeleton variant="circle" className="w-16 h-16 bg-slate-800/90 border border-slate-700/60" />
          <Skeleton variant="text" className="w-48 h-4 bg-slate-800/80" />
        </div>
      </div>

      {/* Server & Player Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#0d121c] border border-slate-800">
        <div className="flex items-center gap-2">
          <Skeleton className="w-28 h-8 rounded-lg bg-slate-800" />
          <Skeleton className="w-28 h-8 rounded-lg bg-slate-800/60" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-24 h-8 rounded-lg bg-slate-800" />
          <Skeleton className="w-24 h-8 rounded-lg bg-slate-800" />
        </div>
      </div>

      {/* Title & Metadata details */}
      <div className="space-y-3">
        <Skeleton variant="text" className="w-2/3 h-7 bg-slate-700 rounded-md" />
        <Skeleton variant="text" className="w-full h-3.5 bg-slate-800" />
        <Skeleton variant="text" className="w-4/5 h-3.5 bg-slate-800" />
      </div>
    </div>
  );
};

/**
 * Skeleton for Catalog Pages (DramasPage, MoviesPage, GenresPage, SearchPage).
 */
export const CatalogPageSkeleton: React.FC<{
  title?: string;
  count?: number;
  className?: string;
}> = ({ count = 10, className = '' }) => {
  return (
    <div className={`space-y-8 animate-in fade-in duration-300 ${className}`}>
      {/* Header Skeleton */}
      <div className="border-b border-slate-800 pb-6 space-y-3">
        <Skeleton variant="text" className="w-28 h-4 bg-rose-900/30" />
        <Skeleton variant="text" className="w-72 h-9 bg-slate-700 rounded-lg" />
        <Skeleton variant="text" className="w-full max-w-xl h-4 bg-slate-800" />
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0d121c] p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <Skeleton className="w-16 h-8 rounded-lg bg-rose-900/40" />
          <Skeleton className="w-20 h-8 rounded-lg bg-slate-800" />
          <Skeleton className="w-20 h-8 rounded-lg bg-slate-800" />
          <Skeleton className="w-24 h-8 rounded-lg bg-slate-800" />
          <Skeleton className="w-20 h-8 rounded-lg bg-slate-800" />
        </div>
        <Skeleton className="w-36 h-8 rounded-lg bg-slate-800 shrink-0" />
      </div>

      {/* Grid of Titles */}
      <TitleGridSkeleton count={count} />
    </div>
  );
};

/**
 * Skeleton for Admin Tables and Dashboards.
 */
export const AdminTableSkeleton: React.FC<{ rows?: number; className?: string }> = ({
  rows = 5,
  className = '',
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Admin Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div className="space-y-2">
          <Skeleton variant="text" className="w-48 h-7 bg-slate-700" />
          <Skeleton variant="text" className="w-64 h-3 bg-slate-800" />
        </div>
        <Skeleton className="w-32 h-10 rounded-lg bg-rose-900/50" />
      </div>

      {/* Search Bar Skeleton */}
      <div className="flex gap-4">
        <Skeleton className="w-full max-w-md h-10 rounded-lg bg-slate-800" />
        <Skeleton className="w-32 h-10 rounded-lg bg-slate-800" />
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-slate-800 bg-[#0d121c] overflow-hidden p-4 space-y-3">
        <div className="grid grid-cols-5 gap-4 pb-3 border-b border-slate-800">
          <Skeleton variant="text" className="w-20 h-4 bg-slate-700" />
          <Skeleton variant="text" className="w-24 h-4 bg-slate-700" />
          <Skeleton variant="text" className="w-16 h-4 bg-slate-700" />
          <Skeleton variant="text" className="w-16 h-4 bg-slate-700" />
          <Skeleton variant="text" className="w-16 h-4 bg-slate-700" />
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={`admin-row-${i}`} className="grid grid-cols-5 gap-4 py-3 items-center">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-14 rounded-md bg-slate-800 shrink-0" />
              <div className="space-y-1 w-full">
                <Skeleton variant="text" className="w-full h-3.5 bg-slate-700" />
                <Skeleton variant="text" className="w-2/3 h-2.5 bg-slate-800" />
              </div>
            </div>
            <Skeleton variant="text" className="w-20 h-4 bg-slate-800" />
            <Skeleton className="w-16 h-6 rounded-md bg-slate-800" />
            <Skeleton variant="text" className="w-12 h-4 bg-slate-800" />
            <div className="flex gap-2">
              <Skeleton className="w-8 h-8 rounded-lg bg-slate-800" />
              <Skeleton className="w-8 h-8 rounded-lg bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export type GlobalSkeletonVariant =
  | 'home'
  | 'detail'
  | 'watch'
  | 'catalog'
  | 'grid'
  | 'admin'
  | 'generic';

export interface GlobalSkeletonLoaderProps {
  variant?: GlobalSkeletonVariant;
  count?: number;
  className?: string;
}

/**
 * Global Skeleton Loader component for SeoulPlay.
 * Used across pages to show seamless shimmers matching the target layout while database data loads.
 */
export const GlobalSkeletonLoader: React.FC<GlobalSkeletonLoaderProps> = ({
  variant = 'generic',
  count = 10,
  className = '',
}) => {
  switch (variant) {
    case 'home':
      return (
        <div className={`space-y-12 animate-in fade-in duration-200 ${className}`}>
          <HeroBannerSkeleton />
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton variant="text" className="w-48 h-6 bg-slate-700" />
              <Skeleton variant="text" className="w-20 h-4 bg-slate-800" />
            </div>
            <TitleGridSkeleton count={count || 5} />
          </section>
        </div>
      );

    case 'detail':
      return <TitleDetailSkeleton className={className} />;

    case 'watch':
      return <WatchPlayerSkeleton className={className} />;

    case 'catalog':
      return <CatalogPageSkeleton count={count} className={className} />;

    case 'grid':
      return <TitleGridSkeleton count={count} className={className} />;

    case 'admin':
      return <AdminTableSkeleton className={className} />;

    case 'generic':
    default:
      return (
        <div className={`space-y-6 p-4 max-w-4xl mx-auto animate-in fade-in duration-200 ${className}`}>
          <Skeleton variant="text" className="w-1/3 h-8 bg-slate-700" />
          <Skeleton variant="text" className="w-2/3 h-4 bg-slate-800" />
          <Skeleton className="w-full h-48 rounded-xl bg-slate-800" />
          <div className="space-y-2">
            <Skeleton variant="text" className="w-full h-3.5 bg-slate-800" />
            <Skeleton variant="text" className="w-5/6 h-3.5 bg-slate-800" />
            <Skeleton variant="text" className="w-4/6 h-3.5 bg-slate-800" />
          </div>
        </div>
      );
  }
};
