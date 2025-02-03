import { type Tables } from "@/app/_lib/supabase";

import { getCabins } from "@/app/_lib/data-service";
//import { unstable_noStore as noStore } from "next/cache";

import CabinCard from "@/app/_components/CabinCard";

type CabinType = Omit<Tables<"cabins">, "created_at" | "description">[];

type FilterType = {
  filter: string;
};

const CabinList = async ({ filter }: FilterType) => {
  //noStore();
  const cabins: CabinType = await getCabins();

  if (!cabins.length) return null;

  let displayedCabins: CabinType = [];
  if (filter === "all") displayedCabins = cabins;
  if (filter === "small")
    displayedCabins = cabins.filter(
      (cabin) => cabin.maxCapacity != null && cabin.maxCapacity <= 3
    );
  if (filter === "medium")
    displayedCabins = cabins.filter(
      (cabin) =>
        cabin.maxCapacity != null &&
        cabin.maxCapacity >= 4 &&
        cabin.maxCapacity <= 7
    );
  if (filter === "large")
    displayedCabins = cabins.filter(
      (cabin) => cabin.maxCapacity != null && cabin.maxCapacity >= 8
    );
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {displayedCabins.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
};

export default CabinList;
