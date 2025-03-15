import { PianoKeyboard } from "./_components/PianoKeyboard";
import { HydrateClient } from "~/trpc/server";

export default function Home() {
  return (
    <HydrateClient>
      <main className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        <div className="container flex flex-col items-center justify-center px-4 py-8">
          <div className="rounded-xl bg-zinc-800/40 p-4 shadow-lg backdrop-blur-sm">
            <PianoKeyboard />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
