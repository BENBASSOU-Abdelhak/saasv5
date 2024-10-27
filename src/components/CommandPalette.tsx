import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface Tag {
  id: string;
  text: string;
}

interface CommandPaletteProps {
  keywords: string;
  setKeywords: (value: string) => void;
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
  subreddit: string;
  setSubreddit: (value: string) => void;
  businessDescription: string;
  setBusinessDescription: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

const SUBREDDIT_SUGGESTIONS = ['aaa', 'bbb', 'ccc'];

const CommandPalette: React.FC<CommandPaletteProps> = ({
  keywords,
  setKeywords,
  tags,
  setTags,
  subreddit,
  setSubreddit,
  businessDescription,
  setBusinessDescription,
  onSubmit,
  loading
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState(SUBREDDIT_SUGGESTIONS);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (subreddit) {
      const filtered = SUBREDDIT_SUGGESTIONS.filter(s => 
        s.toLowerCase().includes(subreddit.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [subreddit]);

  const handleKeywordKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && keywords.trim()) {
      e.preventDefault();
      const newTag = { id: Date.now().toString(), text: keywords.trim() };
      setTags([...tags, newTag]);
      setKeywords('');
    }
  };

  const removeTag = (tagId: string) => {
    setTags(tags.filter(tag => tag.id !== tagId));
  };

  const selectSuggestion = (suggestion: string) => {
    setSubreddit(suggestion);
    setShowSuggestions(false);
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white p-6 rounded-lg shadow-lg space-y-6"
    >
      {/* Keywords with tags */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Keywords *
        </label>
        <div className="min-h-[42px] flex flex-wrap gap-2 p-2 border rounded-md focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
          <AnimatePresence>
            {tags.map(tag => (
              <motion.span
                key={tag.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-indigo-100 text-indigo-800"
              >
                {tag.text}
                <button
                  type="button"
                  onClick={() => removeTag(tag.id)}
                  className="ml-1 inline-flex items-center p-0.5 rounded-full hover:bg-indigo-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
          <input
            ref={inputRef}
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            onKeyDown={handleKeywordKeyDown}
            className="flex-1 min-w-[200px] outline-none"
            placeholder="Press Enter to add keywords"
          />
        </div>
      </div>

      {/* Subreddit with autocomplete */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700">
          Subreddit
        </label>
        <div className="mt-1 relative">
          <input
            type="text"
            value={subreddit}
            onChange={(e) => setSubreddit(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter subreddit name"
          />
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 py-1"
              >
                {filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => selectSuggestion(suggestion)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 focus:bg-indigo-50"
                  >
                    r/{suggestion}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Business Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Business Description
        </label>
        <textarea
          value={businessDescription}
          onChange={(e) => setBusinessDescription(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Describe your business to help refine the search"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || (!keywords && tags.length === 0)}
        onClick={onSubmit}
        className={`flex items-center justify-center w-full rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm
          ${loading || (!keywords && tags.length === 0)
            ? 'bg-indigo-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Searching...
          </>
        ) : (
          <>
            <Search className="w-4 h-4 mr-2" />
            Search Leads
          </>
        )}
      </button>
    </motion.div>
  );
};

export default CommandPalette;