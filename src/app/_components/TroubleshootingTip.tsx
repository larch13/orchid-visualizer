"use client";

import { useState, useRef, useEffect } from "react";

export const TroubleshootingTip: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    }

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  return (
    <div className="fixed bottom-4 left-4">
      <div className="relative">
        {isExpanded && (
          <div
            ref={popupRef}
            className="absolute bottom-12 left-0 w-[400px] rounded-lg border border-zinc-700 bg-zinc-800 p-4 shadow-lg"
          >
            <div className="text-sm text-zinc-300">
              If MIDI notes aren’t appearing, try these steps:
              <ol className="ml-5 mt-1 list-decimal space-y-1 pt-4">
                <li>
                  <span className="font-bold">Refresh the page</span> – This can
                  reset the connection.
                </li>
                <li>
                  <span className="font-bold">Power cycle your Orchid</span> -
                  do NOT press any keys while it boots, wait for the MIDI screen
                  to disappear.
                </li>
              </ol>
              <div className="pt-4">
                If you still have issues, let us know in #orchid-lab on Discord!
                🎹🔍
              </div>
            </div>
            <div className="absolute -bottom-2 left-7 h-4 w-4 rotate-45 transform border-b border-r border-zinc-700 bg-zinc-800"></div>
          </div>
        )}

        <button
          ref={buttonRef}
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 rounded-full border border-zinc-600 bg-zinc-800 px-2 py-1 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          aria-label="Troubleshooting tips"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-500 text-xs">
            ?
          </div>
          <span className="mr-1 text-sm">Troubleshooting</span>
        </button>
      </div>
    </div>
  );
};
