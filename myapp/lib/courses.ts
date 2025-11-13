export type Course = {
  id: string;
  title: string;
  lectures: number;
  lastUpdated: string;
};

export const courses: Course[] = [
  {
    id: "distributed-systems",
    title: "Distributed Systems",
    lectures: 12,
    lastUpdated: "2 days ago",
  },
  {
    id: "advanced-algorithms",
    title: "Advanced Algorithms",
    lectures: 8,
    lastUpdated: "5 days ago",
  },
  {
    id: "machine-learning",
    title: "Machine Learning",
    lectures: 15,
    lastUpdated: "yesterday",
  },
];
