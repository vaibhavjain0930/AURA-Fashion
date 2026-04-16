import { SlidersHorizontal } from "lucide-react";

export default function Loading() {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Skeleton */}
        <div className="text-center mb-16 space-y-4">
          <div className="h-10 md:h-12 w-64 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto animate-pulse"></div>
          <div className="h-[1px] w-24 bg-gray-300 dark:bg-gray-700 mx-auto"></div>
          <div className="h-4 w-full max-w-lg bg-gray-200 dark:bg-gray-800 rounded-full mx-auto animate-pulse"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Filter Toggle Skeleton */}
          <div className="lg:hidden flex justify-between items-center py-4 border-y border-gray-200 dark:border-gray-800 mb-6">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          </div>

          {/* Sidebar Skeleton (Desktop) */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                <SlidersHorizontal className="w-4 h-4 text-gray-200 dark:text-gray-800" />
              </div>
              
              <div className="space-y-8">
                <div>
                   <div className="h-3 w-10 bg-gray-200 dark:bg-gray-800 rounded mb-4 animate-pulse"></div>
                   <div className="flex flex-wrap gap-2">
                       {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>)}
                   </div>
                </div>
                <div>
                   <div className="h-3 w-12 bg-gray-200 dark:bg-gray-800 rounded mb-4 animate-pulse"></div>
                   <div className="flex flex-wrap gap-3">
                       {[1, 2, 3, 4].map(i => <div key={i} className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>)}
                   </div>
                </div>
                 <div>
                   <div className="h-3 w-12 bg-gray-200 dark:bg-gray-800 rounded mb-4 animate-pulse"></div>
                   <div className="space-y-3">
                       {[1, 2, 3].map(i => <div key={i} className="flex gap-2 items-center"><div className="w-4 h-4 rounded-sm bg-gray-200 dark:bg-gray-800 animate-pulse"></div><div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div></div>)}
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid Skeleton */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 lg:gap-x-8">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="group relative">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800 mb-4 animate-pulse"></div>
                  <div className="flex flex-col mt-2 space-y-2">
                     <div className="flex justify-between items-start">
                         <div className="space-y-2 w-full pr-4">
                            <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                            <div className="h-2 w-1/2 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                         </div>
                         <div className="h-3 w-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse flex-shrink-0"></div>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
