import { AppHeader } from "@/components/ui/app-header";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />
      <div className="flex flex-col p-6 h-[calc(100vh-theme(spacing.16))] w-screen overflow-y-scroll">{children}</div>
    </>
  );
}
