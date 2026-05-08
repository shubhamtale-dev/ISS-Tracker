import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar, User, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

function NewsCardSkeleton() {
  return (
    <div className="card p-4 animate-pulse">
      <div className="news-skeleton-img" />
      <div className="news-skeleton-title" />
      <div className="news-skeleton-line" />
      <div className="news-skeleton-line" />
      <div className="news-skeleton-short" />
    </div>
  );
}

export { NewsCardSkeleton };

export default function NewsCard({ article, index = 0 }) {
  const {
    title,
    source,
    author,
    publishedAt,
    urlToImage,
    description,
    url,
  } = article;

  const formattedDate = publishedAt
    ? format(new Date(publishedAt), 'MMM d, yyyy')
    : 'Unknown date';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card overflow-hidden flex flex-col group hover:shadow-xl dark:hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-slate-200 dark:bg-dark-700 flex-shrink-0">
        {urlToImage ? (
          <img
            src={urlToImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = `https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&q=80`;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-slate-400" />
          </div>
        )}
        {/* Source badge */}
        <div className="absolute top-3 left-3">
          <span className="badge badge-blue bg-primary-600/90 text-white backdrop-blur-sm">
            {source?.name || 'Unknown'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formattedDate}
          </span>
          {author && (
            <span className="flex items-center gap-1 truncate">
              <User className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{author.split(',')[0]}</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-snug line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 flex-1">
            {description}
          </p>
        )}

        {/* Read More */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-auto text-xs py-2 justify-center"
          onClick={e => !url && e.preventDefault()}
        >
          <ExternalLink className="w-3 h-3" />
          Read More
        </a>
      </div>
    </motion.article>
  );
}
