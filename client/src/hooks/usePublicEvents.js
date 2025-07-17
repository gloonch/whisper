import { useState } from 'react';

// نمونه رویدادهای عمومی برای تست
const initialPublicEvents = [
  {
    id: 'pe1',
    title: 'Mountain Adventure',
    imageUrl: '/images/mountain.jpg',
    description: 'Amazing hiking trip to the summit'
  },
  {
    id: 'pe2', 
    title: 'Beach Picnic',
    imageUrl: '/images/beach.jpg',
    description: 'Romantic sunset dinner by the ocean'
  },
  {
    id: 'pe3',
    title: 'Concert Night',
    imageUrl: '/images/concert.jpg', 
    description: 'Dancing under the stars'
  },
  {
    id: 'pe4',
    title: 'Cooking Class',
    imageUrl: '/images/cooking.jpg',
    description: 'Learning to make pasta together'
  },
  {
    id: 'pe5',
    title: 'Art Gallery',
    imageUrl: '/images/art.jpg',
    description: 'Exploring local artists exhibition'
  },
  {
    id: 'pe6',
    title: 'Game Night',
    imageUrl: '/images/games.jpg',
    description: 'Board games and laughter'
  },
  {
    id: 'pe7',
    title: 'Garden Visit',
    imageUrl: '/images/garden.jpg',
    description: 'Walking through botanical gardens'
  },
  {
    id: 'pe8',
    title: 'Movie Marathon',
    imageUrl: '/images/movie.jpg',
    description: 'Classic films and popcorn'
  }
];

export function usePublicEvents() {
  const [publicEvents, setPublicEvents] = useState(initialPublicEvents);

  const addToPublicEvents = (event) => {
    const publicEvent = {
      id: `pe_${Date.now()}`,
      title: event.title,
      imageUrl: event.imageUrl || '/images/default.jpg',
      description: event.description || ''
    };
    setPublicEvents(prev => [...prev, publicEvent]);
  };

  const removeFromPublicEvents = (eventId) => {
    setPublicEvents(prev => prev.filter(event => event.id !== eventId));
  };

  return {
    publicEvents,
    addToPublicEvents,
    removeFromPublicEvents
  };
} 