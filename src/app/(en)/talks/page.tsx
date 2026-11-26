import { TalksView, talksMeta } from "@/views/TalksView";

export const metadata = talksMeta("en");

export default function Page() {
  return <TalksView lang="en" />;
}
