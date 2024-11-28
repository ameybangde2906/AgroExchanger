import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
  });

  const isProfileComplete =
    authUser?.address?.state?.trim() &&
    authUser?.address?.district?.trim() &&
    authUser?.address?.subDistrict?.trim() &&
    authUser?.address?.village?.trim();

  if (isLoading) {
    // Show loading spinner while checking auth status
    return <div>Loading...</div>;
  }

  if (!authUser) {
    // If not authenticated, redirect to login
    return <Navigate to="/login" />;
  }

  // If authenticated and profile is complete, render the child component
  return children;
};

export default PrivateRoute;

