import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import BuyersProfile from './pages/profile/Profile';
import Header from './components/Header';
import StoreSelector from './components/StoreSelector';
import Home from './components/Home';
import CompleteProfile from './components/AddLocation';
import BuySell from './components/BuySell';
import ProfilePage from './components/ProfilePage';
import Crops from './pages/crops';
import ProductDetails from './components/ProductDetails';
import BuyNow from './components/BuyNow';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch user from localStorage on initial load
  const { data: authUser, isLoading, isError, error } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/api/auth/me`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      return res.json();
    },
    retry: false,             
  });


  const { mutate: handleLogout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      // Invalidate auth user query and navigate to login page
      queryClient.setQueryData(['authUser'], null); // Clear the authUser state
      navigate("/"); // Redirect to the login page
    },
    onError: () => {
      console.error("Logout failed");
    }
  });

  if (isLoading) {
    return (
      <div className='h-screen flex justify-center items-center'>
        loading
      </div>
    )
  }

  return (
    <div className='flex justify-center'>
      <div className='w-[100%]'>
        {location.pathname !== '/' && (
          <Header onLogout={handleLogout} />
        )}
        <Routes>
          <Route path="/" element={<Home />} />

          {/* {authUser?.role === "buyer" ? <Route
            path="/"
            element={authUser?.role === 'buyer' ? <BuyerDashboard onLogout={handleLogout} /> : <Navigate to="/login" />}
          /> :
            <Route
              path="/"
              element={authUser?.role === 'seller' ? <SellerDashboard onLogout={handleLogout} /> : <Navigate to="/login" />}
            />} */}
          <Route path="/crops" element={<Crops />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/buynow" element={<BuyNow />} />
          <Route path="/profile" element={authUser && <BuyersProfile />} />
          <Route path="/account/*" element={authUser && <ProfilePage onLogout={handleLogout} />} />
          <Route path="/area" element={authUser && < CompleteProfile />} />
          <Route path="/buyorsell" element={authUser && < BuySell />} />
          <Route path="/store/:type" element={<StoreSelector />}></Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

      </div>
    </div>
  );
}


export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

