import { cacheLife } from "next/cache";
import { LandingPage } from "../_components/landing-page";

async function getInitialNow() {
  "use cache";
  cacheLife("seconds");
  return Date.now();
}

export default async function Page() {
  const initialNow = await getInitialNow();
  return <LandingPage initialNow={initialNow} />;
}
