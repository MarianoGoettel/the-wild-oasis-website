import SelectCountry from "@/app/_components/SelectCountry";
import UpdateProfileForm from "@/app/_components/UpdateProfileForm";
import { auth } from "@/app/_lib/auth";
import { getGuest } from "@/app/_lib/data-service";

export const metadata = {
  title: "Profile",
};

const Page = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    /*Warum gibt es hier keinen Fehler?
    session?.user?.email nutzt Optional Chaining (?.)
    Wenn session nicht existiert, gibt session?.user?.email undefined zurück (anstatt einen Fehler zu werfen)
    !undefined wird zu true*/
    return (
      <div className="text-red-500 text-center mt-10">
        No user authenticated
      </div>
    );
  }

  const guest = await getGuest(session.user.email);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-4">
        Update your guest profile
      </h2>

      <p className="text-lg mb-8 text-primary-200">
        Providing the following information will make your check-in process
        faster and smoother. See you soon!
      </p>
      <UpdateProfileForm guest={guest}>
        <SelectCountry
          name="nationality"
          id="nationality"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          defaultCountry={guest?.nationality ?? null}
        />
      </UpdateProfileForm>
    </div>
  );
};

export default Page;
