import { Outlet, createFileRoute } from "@tanstack/react-router";

import { SectionDock, TopBar } from "@/components/exhibit/ExhibitChrome";

export const Route = createFileRoute("/_exhibit")({
  component: ExhibitLayout,
});

function ExhibitLayout() {
  return (
    <div className="flex h-dvh w-screen flex-col overflow-hidden bg-background">
      <TopBar />
      <main className="relative min-h-0 flex-1 overflow-hidden">
        <Outlet />
      </main>
      <SectionDock />
    </div>
  );
}
