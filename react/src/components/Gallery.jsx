export default function Gallery({ images }) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`car-${index}`}
            className="w-full h-48 object-cover rounded-lg shadow"
          />
        ))}
      </div>
    );
  }
  