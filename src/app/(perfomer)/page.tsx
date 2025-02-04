"use client"

import Image from "next/image"
import { useState, useEffect, useCallback } from "react"
import { debounce } from "lodash"
import { useRouter } from "next/navigation"
import useUserStore from "@/store/useUserStore"
import useChatNotifications from "@/store/useChatNotification"
import axiosInstance from "@/shared/axiousintance"
import { useFavoritesStore } from "@/store/useFavoriteEvents"
import usePerformersStore from "@/store/useAllPerformerStore"
import DescriptionViewer from "@/component/descriptionViewer"
import EventRatingPage from "@/component/showEventRating"

interface Event {
  _id?: string
  title: string
  description: string
  imageUrl: string
  price: number
  category: string
  rating: number
  teamLeader: string
  teamLeaderNumber: string
  createdAt: string
  userId: string
  status: string
}

interface Performer {
  userId: string
  bandName: string
  description: string
  profileImage: string
  place: string
  rating: number
}

const categories = [
  { id: "all", name: "All Events" },
  { id: "music", name: "Music" },
  { id: "comedy", name: "Comedy" },
  { id: "speaker", name: "Speakers" },
  { id: "sports", name: "Sports" },
]

const debouncedSearch = debounce((value: string, callback: (value: string) => void) => {
  callback(value)
}, 300)

const EventsPage = () => {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("events")
  const { userProfile, fetchUserProfile } = useUserStore()
  const { favoriteEvents, fetchfavoriteEvents } = useFavoritesStore()
  const { totalUnreadMessage, fetchNotifications } = useChatNotifications()
  const { fetchAllPerformers } = usePerformersStore()

  // Performer states
  const [filteredPerformers, setFilteredPerformers] = useState<Performer[]>([])
  const [performerLoading, setPerformerLoading] = useState(true)
  const [performerError, setPerformerError] = useState<string | null>(null)

  const [performerCurrentPage, setPerformerCurrentPage] = useState(1)
  const [performerTotalPages, setPerformerTotalPages] = useState(1)
  const [performerSortOrder, setPerformerSortOrder] = useState<"asc" | "desc">("desc")

  // Event states
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedEventForRating, setSelectedEventForRating] = useState<string | null>(null)

  // Filter states
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Fetch events with filters
  const fetchFilteredEvents = useCallback(async () => {
    if (!userProfile?.id) {
      console.log("User profile not yet loaded")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await axiosInstance.get(`/userEvent/getFilteredEvents/${userProfile?.id}`, {
        params: {
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          order: sortOrder,
          page: currentPage,
          search: searchQuery || undefined,
        },
      })

      if (response.data) {
        setEvents(response.data.events || [])
        setCurrentPage(response.data.currentPage || 1)
        const pages = Math.ceil(response.data.totalCount / 6)
        setTotalPages(pages || 1)
      } else {
        setEvents([])
        setTotalPages(1)
      }
    } catch (err) {
      setError("Error fetching events")
      setEvents([])
      setTotalPages(1)
    } finally {
      setIsLoading(false)
    }
  }, [userProfile?.id, selectedCategory, sortOrder, currentPage, searchQuery])

  // Fetch performers with filters
  const fetchFilteredPerformers = useCallback(async () => {
    if (!userProfile?.id) {
      console.log("User profile not yet loaded")
      return
    }

    setPerformerLoading(true)
    setPerformerError(null)

    try {
      const response = await axiosInstance.get(`/userEvent/getFilteredPerformers/${userProfile.id}`, {
        params: {
          order: performerSortOrder,
          page: performerCurrentPage,
          search: searchQuery || undefined,
        },
      })

      if (response.data) {
        setFilteredPerformers(response.data.performers || [])
        setPerformerCurrentPage(response.data.currentPage || 1)
        const pages = Math.ceil(response.data.totalCount / 6)
        setPerformerTotalPages(pages || 1)
      } else {
        setFilteredPerformers([])
        setPerformerTotalPages(1)
      }
    } catch (err) {
      setPerformerError("Error fetching performers")
      setFilteredPerformers([])
      setPerformerTotalPages(1)
    } finally {
      setPerformerLoading(false)
    }
  }, [userProfile?.id, performerSortOrder, performerCurrentPage, searchQuery])

  // Initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await fetchUserProfile()
        await Promise.all([fetchNotifications(), fetchfavoriteEvents(), fetchAllPerformers()])
      } catch (error) {
        console.error("Error loading initial data:", error)
      }
    }

    loadInitialData()
  }, [fetchUserProfile, fetchNotifications, fetchfavoriteEvents, fetchAllPerformers])

  // Effect for events
  useEffect(() => {
    if (userProfile?.id) {
      fetchFilteredEvents()
    }
  }, [userProfile?.id, fetchFilteredEvents])

  // Effect for performers
  useEffect(() => {
    if (userProfile?.id && activeTab === "performers") {
      fetchFilteredPerformers()
    }
  }, [userProfile?.id, activeTab, fetchFilteredPerformers])

  const handleShowRatings = (eventId: string) => {
    setSelectedEventForRating(eventId)
  }

  const closeRatingsModal = () => {
    setSelectedEventForRating(null)
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setCurrentPage(1)
  }

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
    setCurrentPage(1)
  }

  const togglePerformerSortOrder = () => {
    setPerformerSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
    setPerformerCurrentPage(1)
  }

  const handleWishlist = async (id: string | undefined) => {
    if (!userProfile?.id || !id) return

    try {
      await axiosInstance.post(`/userEvent/toggleFavoriteEvent/${userProfile.id}/${id}`)
      await fetchfavoriteEvents()
    } catch (error) {
      console.error("Error toggling wishlist:", error)
    }
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handlePerformerPageChange = (pageNumber: number) => {
    setPerformerCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  // Loading state
  if (!userProfile?.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <a
              href="/home"
              className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition duration-300"
            >
              BookItNow
            </a>
          </div>

          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 transition duration-300"
            >
              Menu
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <a
              href="/home"
              className="text-gray-700 hover:text-blue-600 transition duration-300"
            >
              Home
            </a>
            <a
              href="/events"
              className="text-blue-600 font-semibold transition duration-300"
            >
              Events
            </a>
            <a
              href="/about"
              className="text-gray-700 hover:text-blue-600 transition duration-300"
            >
              About
            </a>
            <a
              href="/chat"
              className="relative text-gray-700 hover:text-blue-600 transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2z"
                />
              </svg>
              {totalUnreadMessage > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {totalUnreadMessage}
                </span>
              )}
            </a>
            <a
              href="/profile"
              className="text-gray-700 hover:text-blue-600 transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A7 7 0 1112 19a7 7 0 01-6.879-5.196m6.879-9.196a3 3 0 100 6 3 3 0 000-6z"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50">
            <div className="fixed right-0 top-0 w-64 h-full bg-white shadow-lg z-50">
              <button
                className="absolute top-4 right-4 text-gray-600"
                onClick={toggleMenu}
              >
                &times;
              </button>
              <div className="flex flex-col p-6">
                <a
                  href="/home"
                  className="text-gray-700 hover:text-blue-600 transition duration-300 mb-4"
                >
                  Home
                </a>
                <a
                  href="/events"
                  className="text-blue-600 font-semibold transition duration-300 mb-4"
                >
                  Events
                </a>
                <a
                  href="/about"
                  className="text-gray-700 hover:text-blue-600 transition duration-300 mb-4"
                >
                  About
                </a>
                <a
                  href="/chat"
                  className="text-gray-700 hover:text-blue-600 transition duration-300 mb-4"
                >
                  Chat
                </a>
                <a
                  href="/profile"
                  className="text-gray-700 hover:text-blue-600 transition duration-300"
                >
                  Profile
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main>
        {/* Header Section */}
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4 text-center">
              {activeTab === "events" ? "Discover Amazing Events" : "Find Talented Performers"}
            </h1>
            <div className="max-w-xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                placeholder={
                  activeTab === "events"
                    ? "Search events by name or description..."
                    : "Search performers by band name..."
                }
                className="w-full px-4 py-2 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) =>
                  debouncedSearch(e.target.value, (value) => {
                    setSearchQuery(value)
                    setCurrentPage(1)
                    setPerformerCurrentPage(1)
                  })
                }
              />
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex justify-center space-x-8 py-4">
              <button
                onClick={() => {
                  setSearchQuery("")
                  setActiveTab("events")
                }}
                className={`text-lg font-semibold px-4 py-2 rounded-lg transition-colors duration-200 ${
                  activeTab === "events" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Events
              </button>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setActiveTab("performers")
                }}
                className={`text-lg font-semibold px-4 py-2 rounded-lg transition-colors duration-200 ${
                  activeTab === "performers" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Performers
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Events Section */}
          {activeTab === "events" && (
            <>
              {/* Categories */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-6 py-2 rounded-full transition duration-300 ${
                      selectedCategory === category.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Sorting and Pagination Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <button
                  onClick={toggleSortOrder}
                  className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 mb-4 sm:mb-0"
                >
                  <span>Sort by Price: {sortOrder === "asc" ? "Low to High" : "High to Low"}</span>
                </button>

                <div className="flex justify-center space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
              </div>

              {/* Events Grid */}
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading events...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600">{error}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {events.map((event) => (
                    <div
                      key={event._id}
                      className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105 relative"
                    >
                     <button
                        onClick={() => handleWishlist(event._id)}
                        className="absolute top-4 right-4 z-10 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-7 w-7 ${
                            favoriteEvents.some(favEvent => favEvent._id === event._id)
                              ? "text-red-500 fill-current"
                              : "text-gray-300 hover:text-red-300"
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>

                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        width={500}
                        height={300}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-semibold">
                            {event.title}
                          </h3>
                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-yellow-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="ml-1 text-gray-600">
                              {event.rating.toFixed(1)}
                            </span>
                            {event.rating > 0 && (
                              <span
                                onClick={() => handleShowRatings(event._id || '')}
                                className="cursor-pointer text-green-600 hover:underline hover:text-green-700 transition duration-300"
                              >
                                Reviews
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4">
                          <DescriptionViewer description={event.description} maxLength={20} />
                        </p>

                        <div className="space-y-2">
                          <p className="text-gray-600">
                            <span className="font-semibold">Price:</span>{" "}
                            {event.price}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-semibold">Category:</span>{" "}
                            {event.category}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-semibold">Team Leader:</span>{" "}
                            {event.teamLeader}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-semibold">Contact:</span>{" "}
                            {event.teamLeaderNumber}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-semibold">Posted:</span>{" "}
                            {new Date(event.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            router.push(`/events/${event.userId}/${event._id}`)
                          }
                          className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300"
                        >
                          Book Now
                        </button>
                      </div>
                  
                    </div>
                  ))}
                </div>
              )}

              {/* No Events Results Message */}
              {!isLoading && !error && events.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">No events found matching your criteria.</p>
                </div>
              )}
            </>
          )}

          {activeTab === "performers" && (
            <>
              {/* Sorting and Pagination Controls for Performers */}
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <button
                  onClick={togglePerformerSortOrder}
                  className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 mb-4 sm:mb-0"
                >
                  <span>Sort by Rating: {performerSortOrder === "asc" ? "Low to High" : "High to Low"}</span>
                </button>

                <div className="flex justify-center space-x-2">
                  {Array.from({ length: performerTotalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePerformerPageChange(pageNum)}
                      className={`px-3 py-1 rounded-md ${
                        performerCurrentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
              </div>

              {/* Performers Grid */}
              {performerLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading performers...</p>
                </div>
              ) : performerError ? (
                <div className="text-center py-12">
                  <p className="text-red-600">{performerError}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPerformers.map((performer) => (
                    <div
                      key={performer.userId}
                      className="bg-white rounded-lg shadow-lg p-6 text-center transform transition-all hover:scale-105"
                    >
                      <Image
                        src={performer.profileImage || "/default-profile.jpg"}
                        alt={performer.bandName || "Performer"}
                        width={128}
                        height={128}
                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                      />
                      <h3 className="text-xl font-semibold mb-2">{performer.bandName}</h3>
                      <p className="text-gray-600 mb-3">
                        <DescriptionViewer description={performer.description} maxLength={15} />
                      </p>
                      <div className="flex items-center justify-center mb-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-yellow-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 text-gray-600">{performer.rating.toFixed(1)}</span>
                      </div>
                      <p className="text-gray-600 mb-4">
                        <strong>Location:</strong> {performer.place}
                      </p>
                      <button
                        onClick={() => router.push(`/events/${performer.userId}`)}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300"
                      >
                        View Profile
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* No Performers Results Message */}
              {!performerLoading && !performerError && filteredPerformers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">No performers found matching your criteria.</p>
                </div>
              )}
            </>
          )}

          {/* Ratings Modal */}
          {selectedEventForRating && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-white rounded-lg w-11/12 md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-y-auto relative">
                <button
                  onClick={closeRatingsModal}
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-60"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <EventRatingPage eventId={selectedEventForRating} />
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-8 mt-16">
        <p>&copy; 2024 BookItNow. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default EventsPage

