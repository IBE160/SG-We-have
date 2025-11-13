import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Editor } from "@tiptap/react";

interface CommandRange {
  from: number;
  to: number;
}

export interface SlashCommandsListProps {
  items: {
    title: string;
    icon: React.ReactNode;
    command: (props: { editor: Editor; range: CommandRange }) => void;
  }[];
  command: (item: {
    title: string;
    icon: React.ReactNode;
    command: (props: { editor: Editor; range: CommandRange }) => void;
  }) => void;
}

export interface SlashCommandsListRef {
  onKeyDown: (event: React.KeyboardEvent) => boolean;
}

export const SlashCommandsList = forwardRef((props: SlashCommandsListProps, ref: React.Ref<SlashCommandsListRef>) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command(item);
    }
  };

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length
    );
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => {
    setTimeout(() => setSelectedIndex(0), 0);
  }, [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }
      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }
      if (event.key === "Enter") {
        enterHandler();
        return true;
      }
      return false;
    },
  }));

  return (
    <div className="items-container">
      {props.items.map((item, index) => (
        <button
          className={`item ${index === selectedIndex ? "is-selected" : ""}`}
          key={index}
          onClick={() => selectItem(index)}
        >
          <div className="flex items-center gap-2">
            {item.icon}
            <span>{item.title}</span>
          </div>
        </button>
      ))}
    </div>
  );
});

SlashCommandsList.displayName = "SlashCommandsList";
