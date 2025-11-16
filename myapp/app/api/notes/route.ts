import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

// Define the path to the notes.ts file
const notesFilePath = path.join(process.cwd(), 'myapp', 'lib', 'notes.ts');

export async function POST(request: Request) {
  try {
    const newNote = await request.json();

    // Read existing notes
    const notesContent = readFileSync(notesFilePath, 'utf-8');
    // Extract the array part from the notes.ts file content
    const notesMatch = notesContent.match(/export const notes: Note\[\] = (\[[\s\S]*?\]);/);
    console.log("notesContent:", notesContent);
    console.log("notesMatch:", notesMatch);

    let notes = [];
    if (notesMatch && notesMatch[1]) {
      // Safely evaluate the string as JavaScript code to get the array
      // This is generally unsafe with untrusted input, but here we control the file content.
      notes = eval(`(${notesMatch[1]})`);
    }

    // Add the new note
    notes.push(newNote);

    // Generate the updated content for notes.ts
    const updatedNotesContent = `export type Note = {
  id: string;
  courseId: string;
  title: string;
  content: string;
};

export const notes: Note[] = ${JSON.stringify(notes, null, 2)};
`;

    // Write the updated content back to notes.ts
    writeFileSync(notesFilePath, updatedNotesContent, 'utf-8');

    return NextResponse.json({ message: 'Note saved successfully', note: newNote }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error saving note:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Error saving note', error: errorMessage }, { status: 500 });
  }
}
