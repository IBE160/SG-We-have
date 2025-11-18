# Design Specification: StudyTool

This document outlines the design system for the StudyTool application, based on the new visual direction.

## 1. Color Palette

The color palette is designed to be modern, clean, and accessible.

| Name               | Hex       | Tailwind Class      | Usage                               |
| ------------------ | --------- | ------------------- | ----------------------------------- |
| **Primary**        | `#D0BB95` | `bg-primary`        | Main brand color, primary actions   |
| **Accent Blue**    | `#007AFF` | `bg-accent-blue`    | Secondary actions, informational    |
| **Accent Green**   | `#30D158` | `bg-accent-green`   | Success states, positive feedback   |
| **Accent Purple**  | `#AF52DE` | `bg-accent-purple`  | Tertiary actions, special features  |
| **Text Primary**   | `#1D1D1F` | `text-text-primary` | Main text, headings                 |
| **Text Secondary** | `#6E6E73` | `text-text-secondary` | Subheadings, captions, helper text  |
| **Background Light**| `#f7f7f6` | `bg-background-light`| Main application background         |
| **Border Light**   | `#E5E5EA` | `border-border-light`| Borders for cards, inputs, etc.   |

## 2. Typography

The typography is based on the **Inter** font family, which is chosen for its excellent readability on screens.

-   **Font Family:** `Inter`, sans-serif
-   **Weights:**
    -   Normal: `400`
    -   Medium: `500`
    -   Bold: `700`
    -   Black: `900`

### Headings

-   **Display:** `text-5xl font-black`
-   **Heading 1:** `text-4xl font-bold`
-   **Heading 2:** `text-3xl font-semibold`
-   **Heading 3:** `text-2xl font-medium`

### Body Text

-   **Paragraph:** `text-base`
-   **Secondary Text:** `text-sm text-text-secondary`

## 3. Components

Components are built using Tailwind CSS utility classes.

### Buttons

-   **Primary:** Solid background (`bg-primary`), white text, rounded corners (`rounded-lg`).
-   **Secondary:** White background, light border (`border-border-light`), primary text color, rounded corners.
-   **Ghost:** Transparent background, no border, secondary text color.

### Cards

-   Rounded corners (`rounded-xl`).
-   Soft shadow (`shadow-soft`).
-   Light border (`border-border-light`).
-   Can have a "glassmorphism" effect with a semi-transparent background and backdrop blur.

### Form Elements

-   Inputs have a light border, rounded corners, and a blue focus ring.
-   Labels are `text-sm` and `font-medium`.

## 4. Iconography

The design system uses **Google Material Symbols** for icons. This provides a wide range of clean, modern icons that are consistent with the overall aesthetic.

## 5. Implementation Examples

For practical examples of this design system in use, please refer to the following files:

-   **[Live Component Showcase](./color-theme-visualizer.html)**: A live demonstration of the colors, typography, and components.
-   **[Login Page](./stitch/login.html)**: Example of a centered form layout, inputs, and primary buttons.
-   **[Dashboard](./stitch/home-dashboard.html)**: Example of a sidebar layout, glassmorphism cards, and accent colors.
-   **[Notes Page](./stitch/notes.html)**: Example of a two-column layout and rich text editor styling.
-   **[Quiz Page](./stitch/quiz.html)**: Example of form elements like select menus and checkboxes in a full-page layout.
