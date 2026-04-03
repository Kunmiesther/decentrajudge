export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-text-tertiary text-xs tracking-widest uppercase">
          © 2026 Sovereign Justice. Secured by GenLayer.
        </p>
        <div className="flex items-center gap-6">
          {['Terms', 'Privacy', 'Docs'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-text-tertiary text-xs tracking-widest uppercase hover:text-text-secondary transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}