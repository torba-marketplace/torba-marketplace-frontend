import { homeMock } from '@/data/home';
import type { HomeFeed } from '@/types/home';

/**
 * Home page data source.
 * Swap the mock for `fetch(`${API}/home`)` when the backend is ready.
 */
export async function getHomeFeed(): Promise<HomeFeed> {
  return homeMock;
}
