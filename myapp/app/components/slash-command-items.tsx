import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  MessageSquareQuote,
  Text,
  CheckSquare,
  HelpCircle,
  MessageSquare,
} from "lucide-react";
import { Editor, Range } from "@tiptap/react";

interface Command {
  title: string;
  icon: React.ReactNode;
  command: ({ editor, range }: { editor: Editor; range: Range }) => void;
}

export const slashCommandItems: Command[] = [
  {
    title: "Text",
    icon: <Text size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("paragraph").run();
    },
  },
  {
    title: "Heading 1",
    icon: <Heading1 size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run();
    },
  },
  {
    title: "Heading 2",
    icon: <Heading2 size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run();
    },
  },
  {
    title: "Heading 3",
    icon: <Heading3 size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run();
    },
  },
  {
    title: "Bullet List",
    icon: <List size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "Ordered List",
    icon: <ListOrdered size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: "Quote",
    icon: <MessageSquareQuote size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
  },
  {
    title: "Task List",
    icon: <CheckSquare size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    title: "Question Block",
    icon: <HelpCircle size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("questionBlock").run();
    },
  },
  {
    title: "Answer Block",
    icon: <MessageSquare size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("answerBlock").run();
    },
  },
];
