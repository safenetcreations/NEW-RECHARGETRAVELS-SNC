
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TransferHomePage } from './pages/TransferHomePage';
import { BookingPage } from './pages/BookingPage';
import { TrackingPage } from './pages/TrackingPage';
import { MyBookingsPage } from './pages/MyBookingsPage';

export const TransferRoutes = () => {
  return (
    <Routes>
      <Route index element={<TransferHomePage />} />
      <Route path="book" element={<BookingPage />} />
      <Route path="track/:bookingNumber" element={<TrackingPage />} />
      <Route path="my-bookings" element={<MyBookingsPage />} />
    </Routes>
  );
};
