import Link from 'next/link'

const FOOTER_LINKS = {
  Shop: [
    { label: 'Shop ', href: '/shop' },
  ],
  Help: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
    { label: 'Shipping & Returns', href: '/policies/shipping-and-returns' },
    { label: 'Refund Policy', href: '/policies/refund-policy' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Privacy Policy', href: '/policies/privacy-policy' },
    { label: 'Terms of Service', href: '/policies/terms-of-service' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-olive/10 bg-stone-900 text-ivory">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="block">
              <span className="font-display text-xl font-semibold tracking-tight text-ivory">
                Don&apos;t Tell Mama
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-stone-400">
              Quiet luxury for the woman who knows exactly who she is.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold">
                {heading}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-stone-400 transition-colors hover:text-ivory"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-stone-800 pt-8 sm:flex-row">
          <p className="text-xs text-stone-500">
            © {new Date().getFullYear()} Don&apos;t Tell Mama. All rights reserved.
          </p>
          <p className="text-xs text-stone-500">
            Made with intention in India&nbsp;🇮🇳
          </p>
        </div>
      </div>
    </footer>
  )
}
