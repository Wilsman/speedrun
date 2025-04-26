import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

// Define props interface
interface NotepadProps {
  isVisible: boolean;
  onClose: () => void;
}

export function Notepad({ isVisible, onClose }: NotepadProps) {
  const noteData = useQuery(api.notes.getNote);
  const saveNote = useMutation(api.notes.saveNote);
  const [noteContent, setNoteContent] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const debounceTimeoutRef = useRef<number | null>(null);

  // Update local state when note data is fetched or changes
  useEffect(() => {
    if (noteData !== undefined) {
      setNoteContent(noteData?.content ?? '');
    }
  }, [noteData]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = event.target.value;
    setNoteContent(newContent);

    // Clear existing timeout if any
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set a new timeout
    debounceTimeoutRef.current = window.setTimeout(() => {
      setIsSaving(true);
      try {
        void saveNote({ content: newContent });
      } catch (error) {
        console.error("Failed to save note:", error);
      } finally {
        setIsSaving(false);
        debounceTimeoutRef.current = null; // Clear ref after execution
      }
    }, 1000); // 1 second debounce
  };

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  if (noteData === undefined) {
    // Show skeleton loader while fetching data
    // Still render the container div for consistent positioning if needed during load
    return (
      <div className="fixed bottom-4 left-4 z-20 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4 text-gray-400">
        Loading notes...
      </div>
    );
  }

  return (
    // Floating container
    <div className="fixed bottom-4 left-4 z-20 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4 space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-amber-400 flex items-center">
          Notepad
          {isSaving && <span className="ml-2 text-xs text-gray-400">(Saving...)</span>}
        </h3>
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="text-gray-400 hover:text-gray-200 transition-colors p-1 -mr-1"
          title="Close Notepad"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <textarea
        placeholder="Write your notes here..."
        value={noteContent}
        onChange={handleChange}
        className="min-h-[200px] w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:border-amber-500 focus:ring-amber-500 focus:outline-none"
        rows={10}
      />
    </div>
  );
}
