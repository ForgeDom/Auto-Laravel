import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from './Header';

function CarList() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://127.0.0.1:8000/api/cars");
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        setCars(data);
      } catch (err) {
        console.error("Помилка завантаження списку авто:", err);
        setError("Не вдалося завантажити список авто");
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-500">Завантаження...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;


  return (
    <>
    <Header/>
    <div className="p-8 max-w-8xl mx-auto bg-gray-200">
      
      <h1 className="text-3xl font-bold mb-6 text-center">Каталог</h1>
      {cars.length === 0 ? (
      <p className="text-center text-gray-700 text-lg mt-12">
        Немає доступних авто
      </p>):(
        <div className="flex flex-wrap justify-center gap-6">
        {cars.map((car) => (
          <div
            key={car.id}
            className="m-4 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:scale-105 flex flex-col max-w-[530px] w-full border-[3px] border-blue-600"
          >
            <div className="relative w-full h-68">
              {car.photos?.length > 0 ? (
                <img
                  src={`http://127.0.0.1:8000/storage/${car.photos[0].photo_path}`}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                  Фото відсутнє
                </div>
              )}
            </div>
  
            <div className="p-4 flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-gray-800 truncate">{car.brand} {car.model}</h2>
              <p className="text-gray-500 text-m">Рік: {car.year}</p>
              <p className="text-blue-600 font-bold text-lg">${car.price}</p>
  
              <Link
                to={`/cars/${car.id}`}
                className="mt-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-center"
              >
                Детальніше
              </Link>
            </div>
          </div>
        ))}
      </div>
      )}
      
    </div>
    </>
  );  
}

export default CarList;
