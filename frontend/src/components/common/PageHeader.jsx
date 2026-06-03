export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="space-y-3">
        {eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.35em] text-primary">{eyebrow}</p> : null}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h1>
          {description ? <p className="max-w-2xl text-muted-foreground">{description}</p> : null}
        </div>
      </div>
      {actions ? <div>{actions}</div> : null}
    </div>
  );
}
