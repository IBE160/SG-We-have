import { ReactRenderer } from "@tiptap/react";
import { Suggestion, SuggestionOptions } from "@tiptap/suggestion";
import tippy from "tippy.js";
import { slashCommandItems } from "./slash-command-items.tsx";
import { SlashCommandsList } from "./SlashCommandsList";

const suggestion: Omit<SuggestionOptions, "editor"> = {
  items: ({ query }) => {
    return slashCommandItems.filter((item) =>
      item.title.toLowerCase().startsWith(query.toLowerCase())
    );
  },

  render: () => {
    let component: ReactRenderer;
    let popup: any;

    return {
      onStart: (props) => {
        component = new ReactRenderer(SlashCommandsList, {
          props,
          editor: props.editor,
        });

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props) {
        component.updateProps(props);

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props) {
        if (props.event.key === "Escape") {
          popup[0].hide();
          return true;
        }
        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
  char: "/",
  command: ({ editor, range, props }) => {
    props.command({ editor, range });
  },
  allow: ({ editor, range }) => {
    return editor.can().deleteRange(range);
  },
};

export default suggestion;
