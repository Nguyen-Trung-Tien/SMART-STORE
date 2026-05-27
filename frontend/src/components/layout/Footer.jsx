import { Facebook, Instagram, Twitter } from "lucide-react";
import { Logo } from "@/components/common/Logo";

const footerGroups = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" },
      { label: "New Arrivals", href: "/#new-arrivals" },
      { label: "Deals", href: "/#deals" },
    ],
  },
  {
    title: "Customer Support",
    links: [
      { label: "Help Center", href: "/#about" },
      { label: "Shipping", href: "/#about" },
      { label: "Returns", href: "/#about" },
      { label: "Contact Us", href: "/#about" },
    ],
  },
];

const socialLinks = [
  { label: "Instagram", icon: Instagram, href: "https://instagram.com" },
  { label: "Twitter", icon: Twitter, href: "https://twitter.com" },
  { label: "Facebook", icon: Facebook, href: "https://facebook.com" },
];

export function Footer() {
  return (
    <footer className="px-3 pb-4 pt-10 md:px-4">
      <div className="mx-auto max-w-[88rem] rounded-[2rem] border border-border/60 bg-card/70 px-6 py-10 shadow-soft backdrop-blur md:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.15fr,0.85fr,0.85fr,0.85fr]">
          <div className="space-y-5">
            <Logo />
            <p className="max-w-sm text-sm leading-7 text-muted-foreground">
              A premium commerce experience with refined merchandising, thoughtful motion, and scalable UI patterns
              built for modern storefront teams.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title} className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-950 dark:text-white">
                {group.title}
              </h3>
              <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                {group.links.map((link) => (
                  <a key={link.label} href={link.href} className="transition hover:text-foreground">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-950 dark:text-white">Follow Us</h3>
            <div className="flex items-center gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-background/70 transition hover:-translate-y-1 hover:border-primary/40 hover:text-primary"
                    aria-label={item.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-border/60 pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© 2026 Smart Store. All rights reserved.</p>
          <p>Crafted for premium commerce experiences across mobile, tablet, and desktop.</p>
        </div>
      </div>
    </footer>
  );
}
