import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

interface SlashCommandsListProps {
  items: {
    title: string;
    icon: React.ReactNode;
    command: (props: { editor: any; range: any }) => void;
  }[];
  command: (item: any) => void;
}

export const SlashCommandsList = forwardRef((props: SlashCommandsListProps, ref) => {
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

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: React.KeyboardEvent }) => {
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
