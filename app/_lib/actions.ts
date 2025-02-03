"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "./auth";
import { getBookings } from "./data-service";
import { supabase } from "./supabase";

const signInAction = async () => {
  await signIn("google", { redirectTo: "/account" });
};

const signOutAction = async () => {
  await signOut({ redirectTo: "/" });
};

type BookingDataType = {
  startDate: Date;
  endDate: Date;
  numNights: number;
  cabinPrice: number;
  cabinId: number;
};

const createBooking = async (
  bookingData: BookingDataType,
  formData: FormData
) => {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const observationValue = formData.get("observations");

  const observation =
    typeof observationValue === "string"
      ? observationValue.slice(0, 1000)
      : null;

  const newBooking = {
    startDate: bookingData.startDate.toISOString(),
    endDate: bookingData.endDate.toISOString(),
    numNights: bookingData.numNights,
    cabinPrice: bookingData.cabinPrice,
    cabinId: bookingData.cabinId,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: observation,
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  const { error } = await supabase
    .from("bookings")
    .insert([newBooking])
    // So that the newly created object gets returned!
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }
  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect("/cabins/thankyou");
};

const updateGuest = async (formData: FormData) => {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const nationalID = formData.get("nationalID") as string | null;
  const nationalityValue = formData.get("nationality") as string | null;

  const nationalIDRegex = /^[a-zA-Z0-9]{6,12}$/;

  if (nationalID && !nationalIDRegex.test(nationalID))
    throw new Error("Please provide a valid nationalID");

  if (nationalityValue) {
    const [nationality, countryFlag]: string[] = nationalityValue.split("%");
    const updateData = { countryFlag, nationalID, nationality };

    const { error } = await supabase
      .from("guests")
      .update(updateData)
      .eq("id", session.user.guestId);

    if (error) {
      throw new Error("Guest could not be updated");
    }
    revalidatePath("/account/profile");
  } else throw new Error("Please provide a country");
};

const deleteBooking = async (bookingId: number) => {
  await new Promise((res) => setTimeout(res, 2000));

  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingsIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingsIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking.");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  revalidatePath("/account/reservations");
};

const updateBooking = async (formData: FormData) => {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  if (formData instanceof FormData && formData.get("bookingId")) {
    const bookingId = Number(formData.get("bookingId"));

    const guestBookings = await getBookings(session.user.guestId);
    const guestBookingsIds = guestBookings.map((booking) => booking.id);

    if (!guestBookingsIds.includes(bookingId))
      throw new Error("You are not allowed to update this booking.");

    const updatedFields = {
      numGuests: Number(formData.get("numGuests")),
      observations: String(formData.get("observations")?.slice(0, 1000)),
    };

    const { error } = await supabase
      .from("bookings")
      .update(updatedFields)
      .eq("id", bookingId)
      .select()
      .single();

    if (error) {
      console.error(error);
      throw new Error("Booking could not be updated");
    }

    revalidatePath("/account/reservations");
    revalidatePath(`/account/reservations/edit/${bookingId}`);
    redirect("/account/reservations");
  } else throw new Error("Invalid form data type");
};

export {
  createBooking,
  deleteBooking,
  signInAction,
  signOutAction,
  updateBooking,
  updateGuest,
};
