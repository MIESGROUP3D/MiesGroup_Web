import { ChannelView, channelMeta } from "@/views/ChannelView";
import { darkViewport } from "@/views/meta";

export const metadata = channelMeta("es");
export const viewport = darkViewport;

export default function Page() {
  return <ChannelView lang="es" />;
}
