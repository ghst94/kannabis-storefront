import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import footerLinks from "@/data/footerLinks"

export function Footer() {
  return (
    <footer className="bg-secondary border-t border-neutral-800 mt-20">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Customer Services Column */}
          <div>
            <h2 className="label-lg text-primary mb-6 tracking-wider">
              Customer Services
            </h2>
            <nav className="space-y-3" aria-label="Customer services navigation">
              {footerLinks.customerServices.map(({ label, path }) => (
                <LocalizedClientLink
                  key={label}
                  href={path}
                  className="block text-secondary hover:text-primary transition-colors text-sm"
                >
                  {label}
                </LocalizedClientLink>
              ))}
            </nav>
          </div>

          {/* About Column */}
          <div>
            <h2 className="label-lg text-primary mb-6 tracking-wider">About</h2>
            <nav className="space-y-3" aria-label="About navigation">
              {footerLinks.about.map(({ label, path }) => (
                <LocalizedClientLink
                  key={label}
                  href={path}
                  className="block text-secondary hover:text-primary transition-colors text-sm"
                >
                  {label}
                </LocalizedClientLink>
              ))}
            </nav>
          </div>

          {/* Connect Column */}
          <div>
            <h2 className="label-lg text-primary mb-6 tracking-wider">Connect</h2>
            <nav className="space-y-3" aria-label="Social media navigation">
              {footerLinks.connect.map(({ label, path }) => (
                <a
                  aria-label={`Go to ${label} page`}
                  title={`Go to ${label} page`}
                  key={label}
                  href={path}
                  className="block text-secondary hover:text-primary transition-colors text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* Newsletter/CTA Column (Optional) */}
          <div>
            <h2 className="label-lg text-primary mb-6 tracking-wider">Stay Updated</h2>
            <p className="text-secondary text-sm mb-4">
              Subscribe to get special offers and updates.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-secondary">
              © {new Date().getFullYear()} Kannabis Marketplace. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-secondary hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-secondary hover:text-primary transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
