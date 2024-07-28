import { EyeTracking } from "@/components/eye-tracking";
import { FER } from "@/components/fer";
import { Speech } from "@/components/speech";
import type { Session } from "@/lib/types";
import { config, retrieve } from "@ui-utils/server";

async function getSession(id: string) {
  const response = await retrieve(`${config.API_URL}/v1/sessions/${id}`);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message ?? "Failed to fetch data");
  }
  const { session } = result.data as {
    session: Session;
  };
  return {
    session,
  };
}

export default async function SessionsPage({
  params,
}: {
  params: { id: string };
}) {
  const { session } = await getSession(params.id);
  return (
    <main className="p-3 md:p-6 flex flex-col items-center justify-center w-full h-full">
      {session.analytics ? (
        <div className="grid grid-cols-2 gap-3 max-w-4xl mx-auto">
          <FER analytics={session.analytics.fer} csv={session.csv?.fer} />
          <Speech analytics={session.analytics.speech} csv={session.csv?.speech} />
          <EyeTracking analytics={session.analytics.eye_tracking} csv={session.csv?.eye_tracking} />
        </div>
      ) : (
        <section className="flex flex-col items-center gap-3">
          <p className="text-muted-foreground">No analytics available</p>
        </section>
      )}
    </main>
  );
}
