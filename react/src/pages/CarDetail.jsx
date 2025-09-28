import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CalendarIcon, CurrencyDollarIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import Header from './Header';
import axios from "axios";


function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPhoto, setCurrentPhoto] = useState(0); 

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/cars/${id}`);
        setCar(res.data);
      } catch (err) {
        console.error("Помилка завантаження авто:", err);
        setError("Не вдалося завантажити авто");
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  const prevPhoto = () => {
    setCurrentPhoto((prev) => (prev === 0 ? car.photos.length - 1 : prev - 1));
  };

  const nextPhoto = () => {
    setCurrentPhoto((prev) => (prev === car.photos.length - 1 ? 0 : prev + 1));
  };

  if (loading) return <p className="text-center mt-6">Завантаження...</p>;
  if (error) return <p className="text-red-500 text-center mt-6">{error}</p>;
  if (!car) return <p className="text-center mt-6">Авто не знайдено</p>;

  return (
    <>
    <Header/>
    <div className="p-8 max-w-5xl mx-auto bg-gray-200 flex flex-col">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition "
      >
        ← Повернутись до списку авто
      </button>
  
      <div className="flex flex-col items-start mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          {car.brand} {car.model}
        </h1>

        {car.photos && car.photos.length > 0 && (
          <div className="relative max-w-3xl w-full h-96 mb-8 rounded-lg overflow-hidden shadow-lg ">
            <div
              className="flex h-full transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentPhoto * 100}%)` }}
            >
              {car.photos.map((photo, idx) => (
                <img
                  key={idx}
                  src={`http://127.0.0.1:8000/storage/${photo.photo_path}`}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full flex-shrink-0 h-full object-cover"
                />
              ))}
            </div>

            <button
              onClick={prevPhoto}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white px-3 py-2 rounded hover:bg-gray-800 transition"
            >
              ‹
            </button>
            <button
              onClick={nextPhoto}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white px-3 py-2 rounded hover:bg-gray-800 transition"
            >
              ›
            </button>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {car.photos.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-3 h-3 rounded-full ${
                    idx === currentPhoto ? "bg-white" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>


      <div className="space-y-8 p-6 bg-white rounded-xl shadow-md max-w-3xl w-full flex flex-col mx-auto">

        <div className="flex items-center gap-4">
          <CalendarIcon className="w-6 h-6 text-gray-500" />
          <p className="text-gray-700 text-lg font-medium">
            <span className="font-semibold">Рік:</span> {car.year}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />
          <p className="text-blue-600 font-bold text-xl">
            <span className="font-semibold">Ціна:</span> ${car.price}
          </p>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <InformationCircleIcon className="w-5 h-5 text-gray-500" />
            <p className="text-gray-500 uppercase text-sm font-medium">Опис</p>
          </div>
          {car.description && (
            <p className="text-gray-700 overflow-y-auto">
              {car.description}
            </p>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default CarDetail;
