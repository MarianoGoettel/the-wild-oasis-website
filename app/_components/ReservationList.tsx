"use client";

import { useOptimistic } from "react";
import ReservationCard from "./ReservationCard";
import { deleteBooking } from "../_lib/actions";

type BookingsPropType = {
  bookings: {
    id: number;
    created_at: string;
    startDate: string | null;
    endDate: string | null;
    numNights: number | null;
    numGuests: number | null;
    totalPrice: number | null;
    guestId: number | null;
    cabinId: number | null;
    cabins: { name: string | null; image: string | null } | null;
  }[];
};

const ReservationList = ({ bookings }: BookingsPropType) => {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (currentBookings, bookingId) => {
      return currentBookings.filter((booking) => booking.id !== bookingId);
    }
  );

  const handleDelete = async (bookingId: number) => {
    optimisticDelete(bookingId);
    await deleteBooking(bookingId);
  };
  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard
          booking={booking}
          key={booking.id}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  );
};

export default ReservationList;
