import Link from "next/link";

const NotFound = () => {
  return (
    <main className="text-center space-y-6 mt-4">
      <h1 className="text-3xl font-semibold">
        You did not choose a resveration
      </h1>
      <Link
        href="/account/reservations"
        className="inline-block bg-accent-500 text-primary-800 px-6 py-3 text-lg"
      >
        Go back to your resverations
      </Link>
    </main>
  );
};

export default NotFound;
