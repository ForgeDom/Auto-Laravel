import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function AdminCarForm() {
  const { id } = useParams(); // id авто, якщо редагуємо
  const navigate = useNavigate();

  // стани форми
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [existingPhotos, setExistingPhotos] = useState([]); // існуючі фото
  const [removedPhotos, setRemovedPhotos] = useState([]);   // фото на видалення
  const [newPhotos, setNewPhotos] = useState([]);           // нові файли
  const [loading, setLoading] = useState(false);

  // Завантажуємо авто для редагування
  useEffect(() => {
    if (!id) return;

    axios.get(`http://127.0.0.1:8000/api/cars/${id}`)
      .then(res => {
        const car = res.data;
        setBrand(car.brand || "");
        setModel(car.model || "");
        setYear(car.year ? car.year.toString() : "");
        setPrice(car.price ? car.price.toString() : "");
        setDescription(car.description || "");
        setExistingPhotos(car.photos || []);
      })
      .catch(err => {
        console.error("Помилка при завантаженні авто:", err);
        alert("Не вдалося завантажити авто");
      });
  }, [id]);

  // Видалення існуючого фото
  const handleDeleteExistingPhoto = (photoId) => {
    setExistingPhotos(prev => prev.filter(p => p.id !== photoId));
    setRemovedPhotos(prev => [...prev, photoId]);
  };

  // Додавання нових фото
  const handleNewPhotosChange = (e) => {
    setNewPhotos(Array.from(e.target.files));
  };

  // Відправка форми
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("brand", brand.trim());
      formData.append("model", model.trim());
      formData.append("year", parseInt(year, 10));
      if (price) formData.append("price", parseFloat(price));
      formData.append("description", description.trim());

      // Додаємо нові фото
      newPhotos.forEach(file => formData.append("photos[]", file));

      // Додаємо фото на видалення
      removedPhotos.forEach(id => formData.append("removed_photos[]", id));

      // Вивід у консоль для перевірки
      // for (let pair of formData.entries()) console.log(pair[0], pair[1]);

      if (id) {
        await axios.post(
          `http://127.0.0.1:8000/api/cars/${id}?_method=PUT`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        await axios.post(
          "http://127.0.0.1:8000/api/cars",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      navigate("/admin/cars"); // Повернення до списку
    } catch (err) {
      console.error("Помилка при збереженні авто:", err);

      if (err.response && err.response.data && err.response.data.errors) {
        const messages = Object.values(err.response.data.errors).flat().join("\n");
        alert("Помилки валідації:\n" + messages);
      } else {
        alert("Помилка при збереженні авто!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-6">
      <h1 className="text-2xl font-bold mb-4">{id ? "Редагувати авто" : "Додати авто"}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" value={brand} onChange={e => setBrand(e.target.value)} placeholder="Марка" className="w-full border px-2 py-1 rounded" required />
        <input type="text" value={model} onChange={e => setModel(e.target.value)} placeholder="Модель" className="w-full border px-2 py-1 rounded" required />
        <input type="number" value={year} onChange={e => setYear(e.target.value)} placeholder="Рік" className="w-full border px-2 py-1 rounded" required />
        <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Ціна" className="w-full border px-2 py-1 rounded" />
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Опис" className="w-full border px-2 py-1 rounded"></textarea>

        <div>
          <label className="block font-semibold mb-1">Додати нові фото</label>
          <input type="file" multiple onChange={handleNewPhotosChange} className="w-full" />
        </div>

        {existingPhotos.length > 0 && (
          <div>
            <p className="font-semibold mb-2">Існуючі фото</p>
            <div className="flex flex-wrap gap-2">
              {existingPhotos.map(photo => (
                <div key={photo.id} className="relative w-32 h-32">
                  <img src={`http://127.0.0.1:8000/storage/${photo.photo_path}`} alt="Car" className="w-full h-full object-cover rounded border" />
                  <button type="button"
                    onClick={() => handleDeleteExistingPhoto(photo.id)}
                    className="absolute top-1 right-1 bg-red-600 text-white px-1 rounded">
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
          {loading ? "Збереження..." : "Зберегти"}
        </button>
      </form>
    </div>
  );
}

export default AdminCarForm;
