import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../../Contexts/UserContext";

export function ProtectedRoute({ children }) {
    const { isAdmin, isLoaded } = useUser();

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    if (!isAdmin()) {
        return <Navigate to="/" />;
    }

    return children;
}
