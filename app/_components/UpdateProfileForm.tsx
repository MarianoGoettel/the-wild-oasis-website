"use client";

import { updateGuest } from "@/app/_lib/actions";
import { type Tables } from "@/app/_lib/supabase";
import Image from "next/image";
import { type ReactNode } from "react";
import { useFormStatus } from "react-dom";

type UpdateProfileFormPropsType = {
  children: ReactNode;
  guest: Tables<"guests"> | null;
};

const UpdateProfileForm = ({ children, guest }: UpdateProfileFormPropsType) => {
  if (!guest) throw new Error("No authenticated user");

  const { fullName, email, nationalID, countryFlag } = guest;

  return (
    <form
      action={updateGuest}
      className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
    >
      <div className="space-y-2">
        <label>Full name</label>
        <input
          name="fullName"
          defaultValue={fullName || ""}
          disabled
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <label>Email address</label>
        <input
          name="email"
          disabled
          defaultValue={email || ""}
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="nationality">Where are you from?</label>
          <div className="relative h-5 w-7">
            <Image
              fill
              src={countryFlag || ""}
              alt="Country flag"
              className="h-5 rounded-sm object-cover"
            />
          </div>
        </div>
      </div>
      {children}

      <div className="space-y-2">
        <label htmlFor="nationalID">National ID number</label>

        <input
          defaultValue={nationalID || ""}
          name="nationalID"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
        />
      </div>

      <div className="flex justify-end items-center gap-6">
        <Button />
      </div>
    </form>
  );
};

const Button = () => {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
    >
      {pending ? "Updating..." : "Update profile"}
    </button>
  );
};

export default UpdateProfileForm;
