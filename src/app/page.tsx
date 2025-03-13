import { PianoKeyboard } from "./_components/PianoKeyboard";
import { HydrateClient } from "~/trpc/server";

export default function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-900">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
          <div className="rounded-xl bg-zinc-800/30 p-4">
            <PianoKeyboard />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
