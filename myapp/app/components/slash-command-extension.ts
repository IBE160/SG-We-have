import Paragraph from "@tiptap/extension-paragraph";
import { Suggestion } from "@tiptap/suggestion";
import suggestion from "./slash-command-suggestion";

export const SlashCommand = Paragraph.extend({
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...suggestion,
      }),
    ];
  },
});
