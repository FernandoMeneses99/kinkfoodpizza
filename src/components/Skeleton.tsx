interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div 
      className={`animate-pulse bg-gray-200 rounded ${className}`}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <Skeleton className="h-40 w-full" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center justify-between mt-4">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-12 w-28 rounded-full" />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function MenuPageSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-red-700 to-red-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <Skeleton className="h-16 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto mb-6" />
        </div>
      </div>
      
      <div className="sticky top-16 bg-white shadow-lg z-40 py-4">
        <div className="container mx-auto px-4">
          <CategorySkeleton />
        </div>
      </div>
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <Skeleton className="h-10 w-48 mb-2" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
          <ProductGridSkeleton />
        </div>
      </section>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative py-20 bg-gradient-to-r from-red-700 to-red-900">
      <div className="container mx-auto px-4 text-center text-white">
        <Skeleton className="h-16 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto mb-6" />
        <div className="flex justify-center gap-4">
          <Skeleton className="h-14 w-48" />
          <Skeleton className="h-14 w-48" />
        </div>
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="text-center">
          <Skeleton className="w-16 h-16 mx-auto mb-3 rounded-full" />
          <Skeleton className="h-10 w-20 mx-auto mb-2" />
          <Skeleton className="h-5 w-16 mx-auto" />
        </div>
      ))}
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-gray-100">
      {[...Array(columns)].map((_, i) => (
        <td key={i} className="py-4 px-4">
          <Skeleton className="h-5 w-full" />
        </td>
      ))}
    </tr>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-32" />
        </div>
      ))}
    </div>
  );
}
