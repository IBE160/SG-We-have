export type Quiz = {
  id: string;
  courseId: string;
  title: string;
  questions: Question[];
};

export type Question = {
  id: string;
  text: string;
  options: Option[];
  correctOptionId: string;
};

export type Option = {
  id: string;
  text: string;
};

export const quizzes: Quiz[] = [
  {
    id: "distributed-systems-quiz-1",
    courseId: "distributed-systems",
    title: "Introduction to Distributed Systems Quiz",
    questions: [
      {
        id: "q1",
        text: "What is a distributed system?",
        options: [
          { id: "o1", text: "A system where components are located on different networked computers" },
          { id: "o2", text: "A system that is distributed over a small area" },
          { id: "o3", text: "A system that is not connected to a network" },
          { id: "o4", text: "A centralized system" },
        ],
        correctOptionId: "o1",
      },
      {
        id: "q2",
        text: "What is the main challenge in distributed systems?",
        options: [
          { id: "o1", text: "Ensuring all components are the same" },
          { id: "o2", text: "Dealing with concurrency and partial failures" },
          { id: "o3", text: "Keeping the system small" },
          { id: "o4", text: "Avoiding networks" },
        ],
        correctOptionId: "o2",
      },
    ],
  },
  {
    id: "advanced-algorithms-quiz-1",
    courseId: "advanced-algorithms",
    title: "Graph Algorithms Quiz",
    questions: [
      {
        id: "q1",
        text: "What is the time complexity of Dijkstra's algorithm using a binary heap?",
        options: [
          { id: "o1", text: "O(V)" },
          { id: "o2", text: "O(E)" },
          { id: "o3", text: "O(V + E)" },
          { id: "o4", text: "O(E log V)" },
        ],
        correctOptionId: "o4",
      },
    ],
  },
];
