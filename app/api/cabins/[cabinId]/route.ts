import { getBookedDatesByCabinId, getCabin } from "@/app/_lib/data-service";
import { NextRequest } from "next/server";

const GET = async (
  request: NextRequest,
  { params }: { params: { cabinId: string } }
) => {
  const { cabinId } = params;

  try {
    const [cabin, bookedDates] = await Promise.all([
      getCabin(Number(cabinId)),
      getBookedDatesByCabinId(Number(cabinId)),
    ]);
    return Response.json({ cabin, bookedDates });
  } catch {
    return Response.json({ message: "Cabin not found" });
  }
};

export { GET };
