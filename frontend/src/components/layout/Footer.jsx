export function Footer() {
  return (
    <footer className="border-t border-border/60 py-6">
      <div className="container flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>Smart Store frontend architecture, built for production deployment.</p>
        <p>React Query for server state. Redux Toolkit for client state.</p>
      </div>
    </footer>
  );
}
