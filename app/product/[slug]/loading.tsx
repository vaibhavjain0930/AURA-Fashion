import { Star, Minus, Plus } from "lucide-react";

export default function Loading() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-white dark:bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Skeleton */}
        <div className="flex gap-2 mb-8">
          <div className="w-12 h-3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          <span className="text-gray-300 dark:text-gray-700">/</span>
          <div className="w-16 h-3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          <span className="text-gray-300 dark:text-gray-700">/</span>
          <div className="w-32 h-3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
        </div>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
          
          {/* Image Gallery Skeleton */}
          <div className="w-full md:w-1/2 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-x-visible hide-scrollbar flex-shrink-0">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-20 h-24 sm:w-24 sm:h-32 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse flex-shrink-0"></div>
              ))}
            </div>
            
            {/* Main Image */}
            <div className="relative aspect-[3/4] md:aspect-auto md:h-[700px] w-full bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
          </div>

          {/* Product Details Skeleton */}
          <div className="w-full md:w-1/2 py-6">
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-gray-200 dark:text-gray-800 fill-gray-200 dark:fill-gray-800 animate-pulse" />
              ))}
              <div className="ml-2 w-20 h-3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            </div>
            
            <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-800 rounded mb-4 animate-pulse"></div>
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded mb-8 animate-pulse"></div>
            
            <div className="space-y-3 mb-10">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
              <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            </div>

            {/* Colors */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-3">
                <div className="w-12 h-3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                <div className="w-16 h-3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
              </div>
              <div className="flex gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-10">
              <div className="flex justify-between items-end mb-3">
                <div className="w-10 h-3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                <div className="w-16 h-3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
              </div>
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-14 h-12 rounded border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center justify-between border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded-lg w-full sm:w-32 h-14 px-4 animate-pulse">
                <Minus className="w-4 h-4 text-gray-300 dark:text-gray-700" />
                <div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded-sm"></div>
                <Plus className="w-4 h-4 text-gray-300 dark:text-gray-700" />
              </div>
              <div className="flex-1 h-14 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
            </div>

            {/* AI Promos */}
            <div className="space-y-4">
               <div className="w-full h-[76px] rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/20 animate-pulse"></div>
               <div className="w-full h-[76px] rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 animate-pulse"></div>
            </div>

            {/* Accordion / Extras */}
            <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8 flex gap-6">
               <div className="w-24 h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
               <div className="w-32 h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
