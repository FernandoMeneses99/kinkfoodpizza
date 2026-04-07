import { ProductGridSkeleton, CategorySkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-red-700 to-red-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="text-8xl mb-4">🍕🌯🍔</div>
          <div className="h-16 w-96 mx-auto mb-4 bg-white/20 rounded-xl animate-pulse" />
          <div className="h-6 w-96 mx-auto bg-white/20 rounded animate-pulse" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
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
              <div className="h-10 w-48 mb-2 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <ProductGridSkeleton />
        </div>
      </section>
    </div>
  );
}
