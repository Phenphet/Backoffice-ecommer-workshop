import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'

import SingIn from './pages/backoffice/Singin';
import Home from './pages/backoffice/Home';
import Product from './pages/backoffice/Product';
import BillSale from './pages/backoffice/BillSale';
import DashBoard from './pages/backoffice/Dashbord';

const router = createBrowserRouter([
  {
    path: '/',
    element: <SingIn/>
  },
  {
    path: '/home',
    element: <Home />
  },
  {
    path: '/product',
    element: <Product />
  },
  {
    path: '/billSale',
    element: <BillSale />
  },
  {
    path: '/dashboard',
    element: <DashBoard />
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);
