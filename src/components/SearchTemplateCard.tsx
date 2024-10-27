import React from 'react';
import { History, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { SearchTemplate } from '../services/airtable';

interface SearchTemplateCardProps {
  template: SearchTemplate;
  isActive: boolean;
  onSelect: (template: SearchTemplate) => void;
}

const SearchTemplateCard: React.FC<SearchTemplateCardProps> = ({ template, isActive, onSelect }) => {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(template)}
      className={`w-full p-4 rounded-lg border transition-colors text-left relative overflow-hidden
        ${isActive 
          ? 'border-indigo-500 bg-indigo-50' 
          : 'border-gray-200 bg-white hover:border-indigo-500'}`}
    >
      {/* Ripple effect */}
      <motion.div
        initial={{ scale: 0, opacity: 0.35 }}
        animate={{ scale: 1, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-indigo-200 rounded-lg"
      />

      <div className="relative space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {template.keywords}
              </p>
              {template.subreddit && (
                <p className="text-sm text-gray-500 truncate">
                  r/{template.subreddit}
                </p>
              )}
            </div>
          </div>
          {template.nb_leads && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {template.nb_leads} leads
            </span>
          )}
        </div>

        {template.nb_leads && (
          <div className="flex items-center space-x-1 text-xs text-green-600">
            <TrendingUp className="w-3 h-3" />
            <span>Success rate: 75%</span>
          </div>
        )}
      </div>
    </motion.button>
  );
};

export default SearchTemplateCard;