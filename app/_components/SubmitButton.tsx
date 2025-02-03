"use client";

import { ReactNode } from "react";
import { useFormStatus } from "react-dom";

type SubmitButtonType = {
  children: ReactNode;
  pendingLabel: string;
};

const SubmitButton = ({ children, pendingLabel }: SubmitButtonType) => {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
    >
      {pending ? pendingLabel : children}
    </button>
  );
};

export default SubmitButton;
