import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage:React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-lg text-gray-600">Page Not Found</p>
      <Link to="/" className="mt-4 text-blue-500">
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
