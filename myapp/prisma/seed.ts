import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.option.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.quiz.deleteMany({});
  await prisma.note.deleteMany({});
  await prisma.course.deleteMany({});

  // Create courses
  const course1 = await prisma.course.create({
    data: {
      title: 'Distributed Systems',
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'Advanced Algorithms',
    },
  });

  // Create notes for course1
  await prisma.note.create({
    data: {
      title: 'Introduction to Distributed Systems',
      content: 'This note covers the basics of distributed systems, including their definition, characteristics, and challenges.',
      courseId: course1.id,
    },
  });

  await prisma.note.create({
    data: {
      title: 'Consensus Algorithms',
      content: 'This note delves into various consensus algorithms like Paxos and Raft, crucial for maintaining consistency in distributed environments.',
      courseId: course1.id,
    },
  });

  // Create notes for course2
  await prisma.note.create({
    data: {
      title: 'Graph Traversal Algorithms',
      content: 'This note explores algorithms for traversing graphs, such as Breadth-First Search (BFS) and Depth-First Search (DFS).',
      courseId: course2.id,
    },
  });

  await prisma.note.create({
    data: {
      title: 'Dynamic Programming',
      content: 'This note introduces dynamic programming as a method for solving complex problems by breaking them down into simpler subproblems.',
      courseId: course2.id,
    },
  });

  // Create quizzes
  const quiz1 = await prisma.quiz.create({
    data: {
      title: 'Introduction to Distributed Systems Quiz',
      courseId: course1.id,
      questions: {
        create: [
          {
            text: 'What is a distributed system?',
            correctOptionId: '', // Will be updated later
            options: {
              create: [
                { text: 'A system where components are located on different networked computers' },
                { text: 'A system that is distributed over a small area' },
                { text: 'A system that is not connected to a network' },
                { text: 'A centralized system' },
              ],
            },
          },
          {
            text: 'What is the main challenge in distributed systems?',
            correctOptionId: '', // Will be updated later
            options: {
              create: [
                { text: 'Ensuring all components are the same' },
                { text: 'Dealing with concurrency and partial failures' },
                { text: 'Keeping the system small' },
                { text: 'Avoiding networks' },
              ],
            },
          },
        ],
      },
    },
  });

  const quiz2 = await prisma.quiz.create({
    data: {
      title: 'Graph Algorithms Quiz',
      courseId: course2.id,
      questions: {
        create: [
          {
            text: "What is the time complexity of Dijkstra's algorithm using a binary heap?",
            correctOptionId: '', // Will be updated later
            options: {
              create: [
                { text: 'O(V)' },
                { text: 'O(E)' },
                { text: 'O(V + E)' },
                { text: 'O(E log V)' },
              ],
            },
          },
        ],
      },
    },
  });

  // Update correctOptionId for quiz1
  const q1 = await prisma.question.findFirst({ where: { quizId: quiz1.id, text: 'What is a distributed system?' } });
  if (q1) {
    const o1 = await prisma.option.findFirst({ where: { questionId: q1.id, text: 'A system where components are located on different networked computers' } });
    if (o1) {
      await prisma.question.update({ where: { id: q1.id }, data: { correctOptionId: o1.id } });
    }
  }

  const q2 = await prisma.question.findFirst({ where: { quizId: quiz1.id, text: 'What is the main challenge in distributed systems?' } });
  if (q2) {
    const o2 = await prisma.option.findFirst({ where: { questionId: q2.id, text: 'Dealing with concurrency and partial failures' } });
    if (o2) {
      await prisma.question.update({ where: { id: q2.id }, data: { correctOptionId: o2.id } });
    }
  }

  // Update correctOptionId for quiz2
  const q3 = await prisma.question.findFirst({ where: { quizId: quiz2.id, text: "What is the time complexity of Dijkstra's algorithm using a binary heap?" } });
  if (q3) {
    const o3 = await prisma.option.findFirst({ where: { questionId: q3.id, text: 'O(E log V)' } });
    if (o3) {
      await prisma.question.update({ where: { id: q3.id }, data: { correctOptionId: o3.id } });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
