import React, { useEffect, useState } from 'react'
import './WatchLater.css'
import { useAuthStore } from '../../store/authUser';
import Swal from 'sweetalert2';
import Navbar from '../../components/Navbar/Navbar';
import { Link } from 'react-router';
import { SMALL_IMG_BASE_URL } from '../../src/utils/constants';
import { Trash } from 'lucide-react';

const WatchLater = () => {
    const [later, setLater] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = useAuthStore((state) => state.user?._id);
  
    useEffect(() => {
      const fetchLater = async () => {
        if (!userId) return;
  
        try {
          const response = await fetch(
            `http://localhost:3000/api/v1/auth/${userId}/later`
          );
  
          if (!response.ok) {
            throw new Error("Watch later could not be found");
          }
  
          const data = await response.json();
          console.log("Watch later:", data);
          setLater(data);
        } catch (error) {
          setError(error.message);
          console.error("Watch Later could not be found:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchLater();
    }, [userId]);
  
    const handleRemoveLater = async (movieId) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to remove this movie from your watch later?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, remove it!",
        cancelButtonText: "No, cancel",
      });
  
      if (!result.isConfirmed) return;
      try {
        const response = await fetch(
          `/api/v1/auth/${userId}/later/${movieId}`,
          {
            method: "DELETE",
          }
        );
  
        if (!response.ok) {
          throw new Error("Remove later failed.");
        }
  
        const data = await response.json();
        console.log("Watch later deleted:", data);
  
        
        setLater((prevLater) =>
          prevLater.filter((lat) => lat.movieId !== movieId)
        );
  
        Swal.fire({
          title: "Removed!",
          text: "The movie has been removed from your watch later list.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("An error occurred while removing the movie", error);
        Swal.fire({
          title: "Error!",
          text: "An error occurred while removing the movie.",
          icon: "error",
        });
      }
    };
  
  //   if (loading) return <p>Favoriler yükleniyor...</p>;
    if (error) return <p>Error: {error}</p>;
  
  
    if (later?.length === 0) {
      return (
          <div className='bg-black min-h-screen text-white'>
              <Navbar />
              <div className='max-w-6xl mx-auto px-4 py-8'>
                  <h1 className='text-3xl font-bold mb-8'>Watch Later</h1>
                  <div className='flex justify-center items-center h-96'>
                      <p className='text-xl'>No watch later movie found</p>
                  </div>
              </div>
          </div>
      );
  }
  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="favorites-container">
        {later.length === 0 ? (
          <p>No movies added yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {later.map((movie) => (
              <div
                key={movie.movieId}
                className="bg-gray-800 p-4 rounded max-h-80"
              >
                <div className="flex flex-col items-center p-1">
                  <Link to={`/watch/${movie.movieId}`}>
                    <img
                      src={SMALL_IMG_BASE_URL + movie.poster}
                      alt={movie.title}
                      className="max-h-60 rounded mx-auto min-w-60 fav-img"
                    />
                  </Link>

                  <div className="title-trash flex items-center justify-between mt-2 w-full">
                    <h2 className="text-l font-bold">{movie.title}</h2>
                    <Trash
                      className="cursor-pointer hover:fill-red-600 hover:text-red-600 fav-trash"
                      onClick={() => handleRemoveLater(movie.movieId)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default WatchLater