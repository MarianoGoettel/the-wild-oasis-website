"use client";

import { useReservation } from "@/app/_components/ReservationContext";
import {
  differenceInDays,
  isPast,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import { DateRange, DayPicker, isDateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Tables } from "../_lib/supabase";

type DatesArrType = string[] | number[] | Date[];

function isAlreadyBooked(range: DateRange, datesArr: DatesArrType) {
  // als letzter Ausweg da wir 100% wissen das range.form und to ein Date objekt sind!
  return (
    range.from instanceof Date &&
    range.to instanceof Date &&
    datesArr.some((date) =>
      isWithinInterval(date, {
        start: range.from as Date,
        end: range.to as Date,
      })
    )
  );
}

type DateSelectorPropsType = {
  settings: Tables<"settings">;
  cabin: Tables<"cabins">;
  bookedDates: Date[];
};

function DateSelector({ settings, cabin, bookedDates }: DateSelectorPropsType) {
  // CHANGE
  const { range, setRange, resetRange } = useReservation();

  const displayRange = isDateRange(range)
    ? isAlreadyBooked(range, bookedDates)
      ? {}
      : range
    : {};

  const { regularPrice, discount } = cabin;

  if (!regularPrice) throw new Error("Cabin has no price");

  const numNights =
    isDateRange(displayRange) &&
    displayRange.to instanceof Date &&
    displayRange.from instanceof Date
      ? differenceInDays(displayRange.to, displayRange.from)
      : 0;

  const cabinPrice = numNights * (regularPrice - (discount || 0));

  // SETTINGS
  const { minBookingLength, maxBookingLength } = settings;

  //if (!minBookingLength || !maxBookingLength) return null;

  return (
    <div className="flex flex-col justify-between">
      <DayPicker
        className="pt-12 place-self-center"
        mode="range"
        selected={isDateRange(displayRange) ? displayRange : undefined}
        onSelect={setRange}
        min={minBookingLength! + 1}
        max={maxBookingLength!}
        fromMonth={new Date()}
        fromDate={new Date()}
        toYear={new Date().getFullYear() + 5}
        captionLayout="dropdown"
        numberOfMonths={2}
        disabled={(currentDate) =>
          isPast(currentDate) ||
          bookedDates.some((date) => isSameDay(date, currentDate))
        }
      />

      <div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[72px]">
        <div className="flex items-baseline gap-6">
          <p className="flex gap-2 items-baseline">
            {discount ? (
              <>
                <span className="text-2xl">${regularPrice - discount}</span>
                <span className="line-through font-semibold text-primary-700">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span className="">/night</span>
          </p>
          {numNights ? (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>{" "}
                <span className="text-2xl font-semibold">${cabinPrice}</span>
              </p>
            </>
          ) : null}
        </div>

        {range != undefined && (range.from || range.to) ? (
          <button
            className="border border-primary-800 py-2 px-4 text-sm font-semibold"
            onClick={resetRange}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default DateSelector;
