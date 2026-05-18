import { ArrowLeft, MapPin, Table2, Code2, Compass } from "lucide-react"

const SCOPE = [
  {
    icon: Table2,
    title: "Geo-field inventory",
    desc: "Full inventory of geo fields across floorplan entities: lat/lng, rotation, scale, anchor — coverage 99.8%.",
  },
  {
    icon: MapPin,
    title: "Camera GPS coverage",
    desc: "Camera geo-field completeness audit across real customer sites, with per-site breakdowns.",
  },
  {
    icon: Code2,
    title: "vAtlas transform spec",
    desc: "Field-by-field mapping from floorplan coordinate space to vAtlas GeoJSON, with sample rows and edge cases.",
  },
  {
    icon: Compass,
    title: "Migration feasibility",
    desc: "Feasibility assessment for lifting floorplan data into Verkada Maps 2.0 via the vAtlas pipeline.",
  },
]

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[420px] -z-10 opacity-45"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 25% 25%, oklch(0.62 0.16 195 / 0.85), transparent), radial-gradient(ellipse 60% 55% at 80% 75%, oklch(0.72 0.18 70 / 0.7), transparent), linear-gradient(135deg, oklch(0.22 0.06 195), oklch(0.22 0.06 70))",
        }}
      />

      <main className="relative mx-auto max-w-3xl px-6 py-16 md:py-24">
        <a
          href="https://ankush-rustagi.github.io/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
        >
          <ArrowLeft className="size-4" />
          Back to index
        </a>

        <header className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-medium uppercase tracking-wider mb-6">
            <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
            Work in progress
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.05] mb-6">
            Floorplans Geo-Field
            <br />
            Inventory
            <span className="text-muted-foreground"> &amp; vAtlas</span>
            <br />
            <span className="text-muted-foreground">Transform.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-prose leading-relaxed">
            A data audit and transform specification for migrating Verkada
            floorplan coordinate data into the Maps 2.0 vAtlas pipeline. Built
            to answer:{" "}
            <em className="text-foreground/80 not-italic">
              how complete is our geo data, and can it feed Maps 2.0?
            </em>
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-6">
            What's coming
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SCOPE.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border bg-card p-5"
              >
                <item.icon className="size-5 text-muted-foreground mb-3" />
                <h3 className="font-medium mb-1.5">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-dashed border-border bg-card/30 p-6">
          <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-3">
            Status
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-1">
            Source canvas built in Cursor:{" "}
            <span className="text-foreground/80 font-mono text-xs">2026-05-14</span>
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Porting geo-field tables, coverage stats, and transform spec to interactive standalone web app.
          </p>
        </section>

        <footer className="mt-24 pt-6 border-t border-border text-xs text-muted-foreground">
          <p>Ankush Rustagi · Verkada Product</p>
        </footer>
      </main>
    </div>
  )
}

export default App
