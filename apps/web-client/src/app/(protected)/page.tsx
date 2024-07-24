import dynamic from "next/dynamic";

const VideoSession = dynamic(() => import("./_components/video-session"), { ssr: false });

export default function DashboardPage() {
  return (
    <main className="w-full h-full">
      <VideoSession />
    </main>
  );
}
