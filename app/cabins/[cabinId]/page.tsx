import Cabin from "@/app/_components/Cabin";
import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";
import { getCabin, getCabins } from "@/app/_lib/data-service";
import { Tables } from "@/app/_lib/supabase";
import { Suspense } from "react";

export type ParamsType = {
  params: {
    cabinId: number;
  };
};

//export const metadata = {
//  title: "Cabin",
//};

export async function generateMetadata({ params }: ParamsType) {
  const cabins: Tables<"cabins"> | null = await getCabin(params.cabinId);
  const { name } = cabins;

  return {
    title: `Cabin ${name}`,
  };
}

export async function generateStaticParams() {
  const cabins = await getCabins();

  const ids = cabins.map((cabin) => ({
    cabinId: String(cabin.id),
  }));
  return ids;
}

const Page = async ({ params }: ParamsType) => {
  const cabin: Tables<"cabins"> | null = await getCabin(params.cabinId);

  if (!cabin) return null;

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Cabin cabin={cabin} />
      <div>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Reserve {cabin.name} today. Pay on arrival.
        </h2>
        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  );
};
export default Page;
