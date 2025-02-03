"use client";

import { differenceInDays } from "date-fns";
import { User } from "next-auth";
import { isDateRange } from "react-day-picker";
import { createBooking } from "../_lib/actions";
import { Tables } from "../_lib/supabase";
import { useReservation } from "./ReservationContext";
import SubmitButton from "./SubmitButton";

type ReservationFormPropsType = {
  cabin: Tables<"cabins">;
  user: User | undefined;
};

function ReservationForm({ cabin, user }: ReservationFormPropsType) {
  if (typeof user === "undefined") throw new Error("User is undefined");

  const { range, resetRange } = useReservation();

  if (
    !isDateRange(range) ||
    !(range.from instanceof Date) ||
    !(range.to instanceof Date)
  ) {
    return (
      <div className="flex items-center justify-center text-accent-400 text-2xl">
        Please choose a reservation date
      </div>
    );
  }

  const { maxCapacity, regularPrice, discount, id: cabinId } = cabin;
  if (regularPrice === null)
    throw new Error("Cabin has no price, please contact support");

  const startDate = range.from;
  const endDate = range.to;

  const numNights = differenceInDays(endDate, startDate);
  const cabinPrice = numNights * (regularPrice - (discount ? discount : 0));
  const bookingData = { startDate, endDate, numNights, cabinPrice, cabinId };

  const createWithBookingData = createBooking.bind(null, bookingData);

  return (
    <div className="scale-[1.01]">
      <div className="bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center">
        <p>Logged in as</p>

        <div className="flex gap-4 items-center">
          {/*  <img
            // Important to display google profile images
            referrerPolicy="no-referrer"
            className="h-8 rounded-full"
            src={user.image}
            alt={user.name}
          />*/}
          <p>{user.email}</p>
        </div>
      </div>

      <form
        action={async (formData) => {
          await createWithBookingData(formData);
          resetRange();
        }}
        className="bg-primary-900 py-10 px-16 text-lg flex gap-5 flex-col"
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity! }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            id="observations"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>

        <div className="flex justify-end items-center gap-6">
          <p className="text-primary-300 text-base">Start by selecting dates</p>
          <SubmitButton pendingLabel="Reserving...">Reserve now</SubmitButton>
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
