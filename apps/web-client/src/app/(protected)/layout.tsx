import { AppHeader } from "@/components/ui/app-header";
import { AppLayout } from "@/components/ui/app-layout";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout>
      <div className="flex-col flex flex-1 overflow-y-scroll bg-muted">
        <AppHeader className="md:flex pr-5" />
        <div className="md:rounded-tl-2xl border border-border bg-background flex flex-col gap-2 flex-1 w-full h-full">
          {children}
        </div>
      </div>
    </AppLayout>
  );
}
