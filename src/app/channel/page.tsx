import { ChannelView, channelMeta } from "@/views/ChannelView";

export const metadata = channelMeta("en");

export default function Page() {
  return <ChannelView lang="en" />;
}
