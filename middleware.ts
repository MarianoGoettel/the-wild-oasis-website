/*import { NextResponse } from "next/server";

type RequestType = {
  url: string;
};

const middleware = (request: RequestType) => {
  console.log(request);
  return NextResponse.redirect(new URL("/about", request.url));
};

export const config = {
  matcher: ["/account", ],
};
export default middleware;*/

import { auth } from "./app/_lib/auth";

export const middleware = auth;

export const config = {
  matcher: ["/account"],
};
