import { PianoKeyboard } from "./_components/PianoKeyboard";
import { HydrateClient } from "~/trpc/server";

export default function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 relative">
        <div className="container flex flex-col items-center justify-center px-4 py-8">
          <div className="rounded-xl bg-zinc-800/40 shadow-lg backdrop-blur-sm p-4">
            <PianoKeyboard />
          </div>
        </div>
        
      </main>
    </HydrateClient>
  );
}
