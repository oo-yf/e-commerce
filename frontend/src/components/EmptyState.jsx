import { Link } from "react-router-dom";

function EmptyState({ message, buttonText, buttonLink = "/" }) {
  return (
    <div className="text-center py-6">
      <p className="mb-4 text-gray-600">{message}</p>
      <Link
        to={buttonLink}
        className="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
      >
        {buttonText}
      </Link>
    </div>
  );
}

export default EmptyState;