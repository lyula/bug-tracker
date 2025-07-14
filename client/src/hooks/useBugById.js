import { useBugs } from './useBugs';

export function useBugById(id) {
  const { bugs } = useBugs();
  return bugs.find((bug) => bug._id === id);
}
