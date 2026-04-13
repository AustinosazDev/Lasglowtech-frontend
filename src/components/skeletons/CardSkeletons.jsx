/**
 * Lazy-style skeleton placeholders for brand cards while data loads.
 * Uses animate-pulse + low-contrast bars (no layout shift vs real cards).
 */

const bar = "rounded-md bg-Primarycolor/[0.12]";

/** Academy / LMS course tile (image + meta + lines) */
export function CourseCardSkeleton() {
  return (
    <div className="brand-card rounded-2xl overflow-hidden" aria-hidden>
      <div className={`aspect-video ${bar} animate-pulse bg-bgcolor2/70`} />
      <div className="p-5 space-y-3">
        <div className={`h-3 w-24 ${bar} animate-pulse`} />
        <div className={`h-5 w-[88%] max-w-[280px] ${bar} animate-pulse`} />
        <div className={`h-3.5 w-full ${bar} animate-pulse`} />
        <div className={`h-3.5 w-[70%] ${bar} animate-pulse`} />
        <div className={`h-3.5 w-32 mt-2 ${bar} animate-pulse`} />
      </div>
    </div>
  );
}

export function CourseCardSkeletonGrid({ count = 6, className = "" }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Public catalogue card (tall image + body) */
export function CatalogueCardSkeleton() {
  return (
    <article className="brand-card rounded-[28px] overflow-hidden" aria-hidden>
      <div className={`h-52 ${bar} animate-pulse bg-bgcolor2/70`} />
      <div className="p-5 space-y-4">
        <div className={`h-4 w-full ${bar} animate-pulse`} />
        <div className={`h-4 w-[90%] ${bar} animate-pulse`} />
        <div className="flex justify-between gap-4 pt-2">
          <div className={`h-8 w-28 ${bar} animate-pulse`} />
          <div className={`h-10 w-32 rounded-full ${bar} animate-pulse`} />
        </div>
      </div>
    </article>
  );
}

export function CatalogueCardSkeletonGrid({ count = 9, className = "" }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <CatalogueCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Admin dashboard catalogue item */
export function AdminCatalogueCardSkeleton() {
  return (
    <article className="brand-card overflow-hidden flex flex-col" aria-hidden>
      <div className={`aspect-[16/10] ${bar} animate-pulse bg-bgcolor2/70`} />
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div className={`h-5 w-[85%] ${bar} animate-pulse`} />
        <div className={`h-3.5 w-full ${bar} animate-pulse`} />
        <div className={`h-3.5 w-[66%] ${bar} animate-pulse`} />
        <div className="flex gap-2 mt-auto pt-4 border-t border-Primarycolor/10">
          <div className={`flex-1 h-9 rounded-lg ${bar} animate-pulse`} />
          <div className={`w-20 h-9 rounded-lg ${bar} animate-pulse`} />
        </div>
      </div>
    </article>
  );
}

export function AdminCatalogueCardSkeletonGrid({ count = 6, className = "" }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <AdminCatalogueCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Compact order / list row inside a brand card */
export function OrderListRowSkeleton() {
  return (
    <div className="brand-card p-4 space-y-3" aria-hidden>
      <div className="flex justify-between gap-2">
        <div className={`h-4 w-[45%] max-w-[200px] ${bar} animate-pulse`} />
        <div className={`h-6 w-20 rounded-full ${bar} animate-pulse`} />
      </div>
      <div className={`h-3 w-48 ${bar} animate-pulse`} />
      <div className={`h-3 w-36 ${bar} animate-pulse`} />
    </div>
  );
}

export function OrderListSkeleton({ rows = 4, className = "" }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }, (_, i) => (
        <OrderListRowSkeleton key={i} />
      ))}
    </div>
  );
}

/** Small stat tile (client dashboard) */
export function StatCardSkeleton() {
  return (
    <article className="brand-card p-4" aria-hidden>
      <div className={`h-3 w-24 ${bar} animate-pulse mb-2`} />
      <div className={`h-8 w-16 ${bar} animate-pulse`} />
    </article>
  );
}

export function StatCardSkeletonRow({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {Array.from({ length: count }, (_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Admin orders table body */
export function OrdersTableSkeleton({ rows = 8 }) {
  const cols = 11;
  return (
    <table className="w-full min-w-[1200px] text-sm" aria-hidden>
      <tbody>
        {Array.from({ length: rows }, (_, r) => (
          <tr key={r} className="border-b border-Primarycolor/10">
            {Array.from({ length: cols }, (_, c) => (
              <td key={c} className="py-3 px-4 align-middle">
                <div
                  className={`h-3.5 w-full max-w-[120px] ${bar} animate-pulse ${c === 3 ? "max-w-[200px]" : ""}`}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Client “My orders” table (6 columns) */
const tableBar = "rounded-md bg-Primarycolor/[0.12]";

export function ClientOrdersTableSkeleton({ rows = 6, className = "" }) {
  const colMax = ["max-w-[90px]", "max-w-[200px]", "max-w-[120px]", "max-w-[80px]", "max-w-[100px]", "max-w-[140px]"];
  return (
    <table className={`w-full text-[0.875rem] ${className}`} aria-hidden>
      <thead>
        <tr className="text-left text-gray-400 border-b border-Primarycolor/20">
          {Array.from({ length: 6 }, (_, i) => (
            <th key={i} className="py-3 pr-4 font-semibold">
              <div className={`h-3 w-16 ${tableBar} animate-pulse`} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }, (_, r) => (
          <tr key={r} className="border-b border-Primarycolor/10">
            {Array.from({ length: 6 }, (_, c) => (
              <td key={c} className="py-3 pr-4">
                <div className={`h-3.5 w-full ${colMax[c]} ${tableBar} animate-pulse`} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Blog grid tile (matches `blogcard` aspect) */
export function BlogGridTileSkeleton() {
  return (
    <article className="rounded-xl brand-card overflow-hidden flex flex-col" aria-hidden>
      <div className={`aspect-[16/10] max-h-44 ${bar} animate-pulse bg-bgcolor2/70`} />
      <div className="p-4 md:p-5 flex flex-col flex-1 space-y-2">
        <div className={`h-3 w-20 ${bar} animate-pulse`} />
        <div className={`h-4 w-full ${bar} animate-pulse`} />
        <div className={`h-4 w-[88%] ${bar} animate-pulse`} />
        <div className={`h-3 w-24 mt-auto ${bar} animate-pulse`} />
      </div>
    </article>
  );
}

export function BlogGridTileSkeletonGrid({ count = 6, className = "" }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <BlogGridTileSkeleton key={i} />
      ))}
    </div>
  );
}

/** Admin LMS course row card */
export function LmsCourseListItemSkeleton() {
  return (
    <div className="brand-card p-5 rounded-xl" aria-hidden>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="space-y-2 flex-1 min-w-0">
          <div className={`h-5 w-[55%] max-w-[280px] ${bar} animate-pulse`} />
          <div className={`h-3 w-full ${bar} animate-pulse`} />
          <div className={`h-3 w-48 ${bar} animate-pulse`} />
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <div className={`h-9 w-20 rounded-md ${bar} animate-pulse`} />
          <div className={`h-9 w-20 rounded-md ${bar} animate-pulse`} />
        </div>
      </div>
    </div>
  );
}

export function LmsCourseListSkeleton({ count = 4, className = "" }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <LmsCourseListItemSkeleton key={i} />
      ))}
    </div>
  );
}

/** Admin career application card */
export function CareerApplicationCardSkeleton() {
  return (
    <article className="brand-card overflow-hidden" aria-hidden>
      <div className="p-5 md:p-6 border-b border-Primarycolor/20 flex flex-col sm:flex-row gap-5">
        <div className={`w-20 h-20 rounded-xl flex-shrink-0 ${bar} animate-pulse bg-bgcolor2/70`} />
        <div className="flex-1 space-y-2 min-w-0">
          <div className={`h-5 w-48 max-w-full ${bar} animate-pulse`} />
          <div className={`h-3 w-full ${bar} animate-pulse`} />
          <div className={`h-3 w-[70%] ${bar} animate-pulse`} />
          <div className={`h-3 w-40 ${bar} animate-pulse`} />
        </div>
      </div>
      <div className="p-4 flex flex-wrap gap-2">
        <div className={`h-9 flex-1 min-w-[120px] max-w-[200px] rounded-lg ${bar} animate-pulse`} />
        <div className={`h-9 w-28 rounded-lg ${bar} animate-pulse`} />
      </div>
    </article>
  );
}

export function CareerApplicationCardSkeletonList({ count = 3, className = "" }) {
  return (
    <div className={`space-y-6 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <CareerApplicationCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Learner careers dashboard — stat row + placeholder strip */
export function CareersDashboardSkeleton() {
  return (
    <div className="space-y-8" aria-hidden>
      <div>
        <div className={`h-6 w-40 ${bar} animate-pulse mb-2`} />
        <div className={`h-4 w-64 ${bar} animate-pulse mb-5`} />
        <StatCardSkeletonRow count={3} />
      </div>
      <div className="brand-card p-6 space-y-3">
        <div className={`h-5 w-36 ${bar} animate-pulse`} />
        <div className={`h-4 w-full max-w-xl ${bar} animate-pulse`} />
        <div className="flex flex-wrap gap-3 pt-2">
          <div className={`h-9 w-32 rounded-lg ${bar} animate-pulse`} />
          <div className={`h-9 w-36 rounded-lg ${bar} animate-pulse`} />
        </div>
      </div>
    </div>
  );
}

/** Blog list card (image left on md) */
export function BlogCardSkeleton() {
  return (
    <div className="brand-card overflow-hidden rounded-xl" aria-hidden>
      <div className="grid md:grid-cols-2 gap-0">
        <div className={`h-56 md:h-64 ${bar} animate-pulse bg-bgcolor2/70`} />
        <div className="p-6 space-y-3 flex flex-col justify-center">
          <div className={`h-4 w-24 ${bar} animate-pulse`} />
          <div className={`h-6 w-full ${bar} animate-pulse`} />
          <div className={`h-4 w-full ${bar} animate-pulse`} />
          <div className={`h-4 w-[75%] ${bar} animate-pulse`} />
        </div>
      </div>
    </div>
  );
}
