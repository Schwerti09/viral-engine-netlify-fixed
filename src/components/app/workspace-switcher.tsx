"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export type WorkspaceOption = { id: string; name: string };

export function WorkspaceSwitcher({ currentId, options }: { currentId: string; options: WorkspaceOption[] }) {
  const [open, setOpen] = useState(false);

  const current = options.find((o) => o.id === currentId) ?? options[0];

  async function switchTo(id: string) {
    if (id === currentId) return;
    await fetch("/api/workspaces/switch", { method: "POST", body: JSON.stringify({ workspaceId: id }) });
    window.location.reload();
  }

  return (
    <div className="relative">
      <Button variant="secondary" size="sm" onClick={() => setOpen((v) => !v)}>
        <span className="max-w-[160px] truncate">{current?.name ?? "Workspace"}</span>
        <ChevronDown className="h-4 w-4" />
      </Button>
      {open ? (
        <div className="absolute left-0 mt-2 w-64 rounded-2xl border border-border bg-popover p-1 shadow-lg">
          {options.map((o) => (
            <button
              key={o.id}
              className={
                "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm hover:bg-muted"
              }
              onClick={() => {
                setOpen(false);
                void switchTo(o.id);
              }}
            >
              <span className="truncate">{o.name}</span>
              {o.id === currentId ? <span className="text-xs text-muted-foreground">active</span> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
