import Link from "next/link";
import { auth } from "../_lib/auth";

export default async function Navigation() {
  const session = await auth();

  return (
    <nav className="z-10 text-xl">
      <ul className="flex gap-16 items-center">
        <li>
          <Link
            href="/cabins"
            className="hover:text-accent-400 transition-colors"
          >
            Cabins
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="hover:text-accent-400 transition-colors"
          >
            About
          </Link>
        </li>
        <li>
          {session?.user?.name ? (
            <Link
              href="/account"
              className="hover:text-accent-400 transition-colors flex gap-4 items-center"
            >
              <span> Guest area</span>
              <span className="border border-accent-600 rounded-3xl p-2">
                {session.user.name}
              </span>
            </Link>
          ) : (
            <Link
              href="/account"
              className="hover:text-accent-400 transition-colors"
            >
              <span> Guest area</span>
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
