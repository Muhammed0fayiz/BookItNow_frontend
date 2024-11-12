'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Event = {
  _id: string;
  title: string;
  imageUrl: string;
  description: string;
  price: string;
  category: string;
  teamLeader: string;
  teamLeaderNumber: string;
  createdAt: string;
  rating: number;
};

type Performer = {
  userId: string;
  bandName: string;
  profileImage: string;
  description: string;
  place: string;
  rating: number;
};

const EventBookingPage = () => {
  const router = useRouter();
  const [performer, setPerformer] = useState<Performer | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch performer and events data (replace with your API calls)
  useEffect(() => {
    // Fetch performer data
    setPerformer({
      userId: 'performer-1',
      bandName: 'The Melodic Minds',
      profileImage: '/performer-profile.jpg',
      description: 'Talented rock band known for their energetic performances.',
      place: 'Los Angeles, CA',
      rating: 4.8
    });

    // Fetch events data
    setEvents([
      {
        _id: 'event-1',
        title: 'The Melodic Minds Live in Concert',
        imageUrl: '/event-image-1.jpg',
        description: 'Join us for an unforgettable evening of live music with The Melodic Minds!',
        price: '$50',
        category: 'Music',
        teamLeader: 'John Doe',
        teamLeaderNumber: '555-1234',
        createdAt: '2023-05-01T00:00:00.000Z',
        rating: 4.7
      },
      {
        _id: 'event-2',
        title: 'The Melodic Minds Summer Tour',
        imageUrl: '/event-image-2.jpg',
        description: 'Don\'t miss the hottest event of the summer - The Melodic Minds on tour!',
        price: '$65',
        category: 'Music',
        teamLeader: 'Jane Smith',
        teamLeaderNumber: '555-5678',
        createdAt: '2023-06-15T00:00:00.000Z',
        rating: 4.9
      },
      {
        _id: 'event-3',
        title: 'The Melodic Minds Acoustic Set',
        imageUrl: '/event-image-3.jpg',
        description: 'Experience The Melodic Minds in an intimate acoustic setting.',
        price: '$40',
        category: 'Music',
        teamLeader: 'Bob Johnson',
        teamLeaderNumber: '555-9012',
        createdAt: '2023-07-01T00:00:00.000Z',
        rating: 4.6
      }
    ]);
  }, []);

  // Filter events based on search query
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <div className="container mx-auto px-4 py-8">
          {/* Performer Profile */}
          <div className="mb-8 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold">Performer Profile</h2>
            <div className="flex items-start mt-4">
              <img
                src={performer?.profileImage || '/default-profile.jpg'}
                alt={performer?.bandName}
                className="w-32 h-32 rounded-full mr-6"
              />
              <div>
                <h3 className="text-xl font-semibold">{performer?.bandName}</h3>
                <p className="text-gray-600">{performer?.description}</p>
                <p className="text-gray-600"><strong>Location:</strong> {performer?.place}</p>
                <p className="text-gray-600"><strong>Rating:</strong> {performer?.rating} / 5</p>
              </div>
            </div>
          </div>

          {/* Events */}
          <div className="mb-8 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Events</h2>
            <div className="flex items-center mb-4">
              <input
                type="text"
                placeholder="Search events..."
                className="w-full px-4 py-2 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700">
                Search
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <div key={event._id} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105">
                  <img src={event.imageUrl} alt={event.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold">{event.title}</h3>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 text-gray-600">{event.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    <div className="space-y-2">
                      <p className="text-gray-600"><span className="font-semibold">Price:</span> {event.price}</p>
                      <p className="text-gray-600"><span className="font-semibold">Category:</span> {event.category}</p>
                      <p className="text-gray-600"><span className="font-semibold">Team Leader:</span> {event.teamLeader}</p>
                      <p className="text-gray-600"><span className="font-semibold">Contact:</span> {event.teamLeaderNumber}</p>
                      <p className="text-gray-600"><span className="font-semibold">Posted:</span> {new Date(event.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => router.push(`/book/${event._id}`)}
                      className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}

              {/* No Events Results Message */}
              {filteredEvents.length === 0 && (
                <div className="text-center py-12 col-span-3">
                  <p className="text-gray-600">No events found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-8 mt-16">
        <p>&copy; 2024 BookItNow. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default EventBookingPage;
