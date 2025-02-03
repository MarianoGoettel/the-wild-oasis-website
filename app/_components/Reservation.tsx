import { auth } from "@/app/_lib/auth";
import { getBookedDatesByCabinId, getSettings } from "../_lib/data-service";
import { Tables } from "@/app/_lib/supabase";

import DateSelector from "@/app/_components/DateSelector";
import ReservationForm from "@/app/_components/ReservationForm";
import LoginMessage from "./LoginMessage";

type CabinType = {
  cabin: Tables<"cabins">;
};

const Reservation = async ({ cabin }: CabinType) => {
  const [settings, bookedDates] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(cabin.id),
  ]);

  const session = await auth();

  return (
    <div className="grid grid-cols-2 border border-primary-800 min-h-[400px]">
      <DateSelector
        settings={settings}
        cabin={cabin}
        bookedDates={bookedDates}
      />
      {session ? (
        <ReservationForm cabin={cabin} user={session.user} />
      ) : (
        <LoginMessage />
      )}
    </div>
  );
};

export default Reservation;
