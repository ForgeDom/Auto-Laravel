import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function AdminCarsList() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    const res = await axios.get("http://localhost:8000/api/cars");
    setCars(res.data);
  };

  const deleteCar = async (id) => {
    if (!window.confirm("Видалити авто?")) return;
    await axios.delete(`http://localhost:8000/api/cars/${id}`);
    fetchCars();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-4">Адмін: Автомобілі</h1>
      <Link to="/admin/cars/new" className="btn mb-4">Додати авто</Link>
      <ul>
        {cars.map(car => (
          <li key={car.id} className="mb-2">
            <strong>{car.brand} {car.model}</strong> ({car.year}) — ${car.price}
            <div>
              <Link to={`/admin/cars/${car.id}`} className="btn mr-2">Редагувати</Link>
              <button onClick={() => deleteCar(car.id)} className="btn btn-danger">Видалити</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminCarsList;
