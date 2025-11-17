import { ReactRenderer } from "@tiptap/react";
import { SuggestionOptions } from "@tiptap/suggestion";
import tippy, { Instance } from "tippy.js";
import { slashCommandItems } from "./slash-command-items";
import { SlashCommandsList, SlashCommandsListProps } from "./SlashCommandsList";

interface SlashCommandsListRef {
  onKeyDown: (event: KeyboardEvent) => boolean;
}

const suggestion: Omit<SuggestionOptions, "editor"> = {
  items: ({ query }) => {
    return slashCommandItems.filter((item) =>
      item.title.toLowerCase().startsWith(query.toLowerCase())
    );
  },

  render: () => {
    let component: ReactRenderer<SlashCommandsListRef, SlashCommandsListProps>;
    let popup: Instance;

    return {
      onStart: (props) => {
        component = new ReactRenderer(SlashCommandsList, {
          props,
          editor: props.editor,
        });

        popup = tippy("body", {
          getReferenceClientRect: () => props.clientRect?.() || new DOMRect(),
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        })[0];

      },

      onUpdate(props) {
        component.updateProps(props);

        (popup as Instance).setProps({
          getReferenceClientRect: () => props.clientRect?.() || new DOMRect(),
        });
      },

      onKeyDown(props) {
        if (props.event.key === "Escape") {
          (popup as Instance).hide();
          return true;
        }
        return component.ref?.onKeyDown(props.event) || false;
      },

      onExit() {
        (popup as Instance).destroy();
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
