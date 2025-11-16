export type Note = {
  id: string;
  courseId: string;
  title: string;
  content: string;
};

export let notes: Note[] = [
  {
    id: "distributed-systems-note-1",
    courseId: "distributed-systems",
    title: "Introduction to Distributed Systems",
    content: "This is the content of the first note for Distributed Systems.",
  },
  {
    id: "distributed-systems-note-2",
    courseId: "distributed-systems",
    title: "Consensus Algorithms",
    content: "This is the content of the second note for Distributed Systems.",
  },
  {
    id: "advanced-algorithms-note-1",
    courseId: "advanced-algorithms",
    title: "Graph Algorithms",
    content: "This is the content of the first note for Advanced Algorithms.",
  },
];
