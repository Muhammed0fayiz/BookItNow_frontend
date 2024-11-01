// // src/store/useProfileStore.ts
// import { create } from 'zustand';
// import type { ProfileState, PerformerDetails, PerformerStats } from '@/types/store';

// const DEFAULT_STATS: PerformerStats = {
//   upcomingEvents: 0,
//   pastEvents: 0,
//   walletBalance: 0,
//   totalReviews: 0
// };

// export const useProfileStore = create<ProfileState>((set) => ({
//   performerDetails: null,
//   stats: DEFAULT_STATS,
//   fetchPerformerData: async () => {
//     try {
//       // Replace with your actual API endpoints
//       const [detailsResponse, statsResponse] = await Promise.all([
//         fetch('/api/performer/details'),
//         fetch('/api/performer/stats')
//       ]);

//       const [details, stats] = await Promise.all([
//         detailsResponse.json(),
//         statsResponse.json()
//       ]);

//       set({
//         performerDetails: details,
//         stats: {
//           upcomingEvents: stats.upcomingEvents || 0,
//           pastEvents: stats.pastEvents || 0,
//           walletBalance: stats.walletBalance || 0,
//           totalReviews: stats.totalReviews || 0
//         }
//       });
//     } catch (error) {
//       console.error('Failed to fetch performer data:', error);
//       // Optionally set some error state here
//     }
//   }
// }));