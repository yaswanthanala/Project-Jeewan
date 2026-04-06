'use client';

import { useState } from 'react';
import { Play, Heart, Share2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface Story {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: 'Recovery' | 'Prevention' | 'Family';
  views: number;
  likes: number;
  color: string;
}

// Demo data saved if needed later
// const DEMO_STORIES: Story[] = [
//   { id: '1', title: "Ravi's 3-year journey", description: 'From darkness to light — how family support changed everything.', duration: '4:32', category: 'Recovery', views: 2100, likes: 456, color: '#d4e8d4' },
//   { id: '2', title: "Priya's story — college", description: 'How she resisted peer pressure and became an advocate.', duration: '3:10', category: 'Prevention', views: 1400, likes: 312, color: '#d4e0f0' },
//   { id: '3', title: "A mother's perspective", description: 'Watching her son recover taught her about unconditional love.', duration: '6:45', category: 'Family', views: 3800, likes: 891, color: '#f0e4d4' },
//   { id: '4', title: "Arjun's comeback story", description: 'Youth recovery program helped him rebuild his life.', duration: '5:20', category: 'Recovery', views: 4521, likes: 923, color: '#d4e8d4' },
//   { id: '5', title: "Finding purpose after addiction", description: "Aisha's journey from rehab to social work.", duration: '4:05', category: 'Recovery', views: 2876, likes: 534, color: '#e0d4f0' },
//   { id: '6', title: "Breaking the cycle", description: 'The Sharma family overcame generational addiction patterns.', duration: '7:30', category: 'Family', views: 5234, likes: 1102, color: '#f0e4d4' },
// ];

const STORIES: Story[] = [];

const CATEGORIES = ['All', 'Recovery', 'Prevention', 'Family'] as const;

export default function StoriesPage() {
  const { t } = useLanguage();
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredStories = activeCategory === 'All' ? STORIES : STORIES.filter(s => s.category === activeCategory);

  const toggleLike = (id: string) => {
    const newLiked = new Set(liked);
    newLiked.has(id) ? newLiked.delete(id) : newLiked.add(id);
    setLiked(newLiked);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">📣 {t('pg.stories.title' as any)}</h1>
            <p className="text-sm text-jeewan-muted mt-1">{t('pg.stories.sub' as any)}</p>
          </div>
          <button className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl border border-jeewan-nature text-jeewan-nature text-sm font-medium hover:bg-jeewan-nature hover:text-white transition">
            + Share Your Story
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                activeCategory === cat
                  ? 'bg-jeewan-calm text-white'
                  : 'border border-border text-jeewan-muted hover:border-jeewan-calm-mid hover:text-jeewan-calm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStories.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-card border border-border rounded-2xl text-sm text-jeewan-muted">
              No stories published yet. Be the first to share your journey!
            </div>
          ) : (
            filteredStories.map((story) => (
              <div key={story.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow group">
              {/* Thumbnail */}
              <div className="relative h-40" style={{ background: story.color }}>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-jeewan-calm rounded-full p-3 shadow-lg">
                    <Play className="h-5 w-5 text-white fill-white" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">{story.duration}</div>
                <div className="absolute top-2 left-2 bg-jeewan-calm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">{story.category}</div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-sm text-foreground mb-1 line-clamp-1">{story.title}</h3>
                <p className="text-xs text-jeewan-muted mb-3 line-clamp-2">{story.description}</p>
                <div className="flex items-center justify-between text-[10px] text-jeewan-muted mb-3">
                  <span>{story.views.toLocaleString()} views</span>
                  <span>{story.likes.toLocaleString()} likes</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleLike(story.id)}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition ${
                      liked.has(story.id)
                        ? 'bg-jeewan-nature text-white'
                        : 'bg-muted text-jeewan-muted hover:bg-jeewan-nature-light hover:text-jeewan-nature'
                    }`}
                  >
                    <Heart className={`h-3.5 w-3.5 ${liked.has(story.id) ? 'fill-white' : ''}`} />
                    Like
                  </button>
                  <button className="flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold bg-muted text-jeewan-muted hover:bg-jeewan-calm-light hover:text-jeewan-calm transition">
                    <Share2 className="h-3.5 w-3.5" />
                    Share
                  </button>
                </div>
              </div>
            </div>
            ))
          )}
        </div>

        {/* Share CTA */}
        <div className="mt-10 bg-gradient-to-r from-jeewan-calm to-jeewan-nature rounded-2xl p-6 md:p-8 text-center text-white">
          <h2 className="text-xl md:text-2xl font-bold mb-2">Your Story Matters</h2>
          <p className="text-white/80 text-sm mb-5">Have you overcome addiction? Share your journey and inspire others.</p>
          <button className="px-6 py-2.5 bg-white text-jeewan-calm rounded-xl font-bold text-sm hover:bg-white/90 transition shadow-lg">
            Share Your Story
          </button>
        </div>
      </div>
    </div>
  );
}
