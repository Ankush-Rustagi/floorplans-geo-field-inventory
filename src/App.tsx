import { ArrowLeft } from "lucide-react"

const SAMPLE_PLANS = [
  { label: "Wiwynn (Manufacturing)", cameras: 615, file: "WYMX-3 Oct 2025.pdf", lat: 31.564061, lng: -106.370781, rotation: 312.97, scale: 0.066, dims: "12960 × 8640", zoom: 16, ext: "PDF" },
  { label: "Georgetown ISD (K-12)", cameras: 50, file: "GAP-Cameras-Doors.pdf", lat: 30.636423, lng: -97.613195, rotation: -20.53, scale: 0.031, dims: "15018 × 10800", zoom: 19, ext: "PDF" },
  { label: "Kitsap County, WA (Gov)", cameras: 25, file: "Pacific Building Verkada.pdf", lat: 47.535286, lng: -122.592923, rotation: -86.56, scale: 0.065, dims: "6120 × 3960", zoom: 19, ext: "PDF" },
  { label: "Weller Truck Parts (Industrial)", cameras: 9, file: "Burlingame_racking.svg", lat: 42.856269, lng: -85.702472, rotation: -271.28, scale: 0.079, dims: "9360 × 4095", zoom: 19, ext: "SVG" },
  { label: "LeTourneau University (Higher Ed)", cameras: 4, file: "LIB1-DataLayout Model (1).pdf", lat: 32.466452, lng: -94.727541, rotation: 0.31, scale: 0.125, dims: "3060 × 3960", zoom: 20, ext: "PDF" },
]

function SectionHeader({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-semibold mt-10 mb-4 text-foreground">{children}</h2>
}

function SectionDesc({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{children}</p>
}

function Divider() {
  return <div className="my-8 border-t border-border" />
}

type Row = (string | React.ReactNode)[]

function DataTable({ headers, rows }: { headers: string[]; rows: Row[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            {headers.map(h => (
              <th key={h} className="p-3 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="p-3 align-top text-xs leading-relaxed">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CodeBlock({ children, lang = "plaintext" }: { children: string; lang?: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 overflow-x-auto">
      <div className="flex items-center px-4 py-2 border-b border-border/50">
        <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">{lang}</span>
      </div>
      <pre className="p-4 text-xs text-muted-foreground font-mono leading-relaxed overflow-x-auto whitespace-pre">
        {children}
      </pre>
    </div>
  )
}

const CONFIDENCE_COLOR: Record<string, string> = {
  High: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Medium: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  Low: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  "N/A": "bg-neutral-500/15 text-neutral-300 border-neutral-500/30",
}

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div
        aria-hidden
        className="fixed inset-x-0 top-0 h-64 -z-10 opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 30% 0%, oklch(0.6 0.16 195 / 0.7), transparent), radial-gradient(ellipse 60% 50% at 80% 0%, oklch(0.7 0.18 70 / 0.5), transparent)" }}
      />
      <main className="mx-auto max-w-5xl px-4 md:px-6 py-10">
        <a href="https://ankush-rustagi.github.io/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="size-4" />Back to index
        </a>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight mb-2">
            Floorplans Geo-Field Inventory<br />
            <span className="text-muted-foreground">and vAtlas Transform</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Complete inventory of every geolocation field in vFootprint (Floorplans 1.0), with 5 real production samples and the exact mapping to vAtlas GeoJSON.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            Source: DynamoDB snapshots via Athena, partition 2026-05-12. Backend: vfloorplans/commons/entities/
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[{ label: "Geo Fields per Plan", value: "10" }, { label: "Geo Fields per Camera", value: "4" }, { label: "Prod Plans Anchored", value: "99.8%", green: true }, { label: "Cameras with GPS", value: "100%", green: true }].map(s => (
            <div key={s.label} className={`rounded-xl border p-4 ${s.green ? "border-emerald-500/30 bg-emerald-500/10" : "border-border bg-card"}`}>
              <div className={`text-2xl font-bold ${s.green ? "text-emerald-300" : ""}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <Divider />

        <SectionHeader>Part 1: Complete Field Inventory (Floorplan Level)</SectionHeader>
        <SectionDesc>Every field on a FloorPlan entity containing or deriving geographic information. Source: floor_plan_entities.py, common_entities.py</SectionDesc>
        <DataTable
          headers={["#", "Field", "Type / Structure", "What It Stores", "Source"]}
          rows={[
            ["1", "bounds", "{north, south, east, west}", "User-supplied lat/lng bounding box. The raw rectangle the user aligned on the Mapbox map. Axis-aligned, does NOT account for rotation.", "User input via frontend drag"],
            ["2", "calculated_bounds", "{north, south, east, west}", "Tighter bounding box adjusted for rotation. Derived from bounds + rotation + image dimensions. The actual geo-extent of the rotated image.", "Computed by _calculate_and_update_bounds()"],
            ["3", "pixel_metadata", "{pxPerLat, pxPerLng, centerLat, centerLng}", "Affine transform coefficients. Maps every pixel on the image to a lat/lng. pxPerLat/pxPerLng are the scale factors; centerLat/centerLng is the image center in WGS84.", "Computed by _calculate_and_update_pixel_metadata()"],
            ["4", "fp_location", "{center, topLeft, topRight, bottomLeft, bottomRight}", "5 GPS points: the 4 corners of the image AFTER rotation, plus the center. Each is {lat, lng}. This is the rotation-aware ground truth for the image footprint.", "Computed by _calculate_and_update_floor_plan_loc()"],
            ["5", "rotation", "float (degrees)", "User-set rotation angle. Can exceed 360 or go negative (e.g. -271, 312). All derived fields account for this.", "User input"],
            ["6", "scale", "float", "User-set scale factor. Represents meters-per-pixel (range 0.03–0.64 in sample data).", "User input"],
            ["7", "web_image", "{s3Info: {bucket, key}, extension, filename, dimensions}", "The raster image asset. S3 location, original filename, pixel dimensions. Bucket is always verkada-floor-plans-prod1, key prefix processed/.", "S3 upload pipeline"],
            ["8", "master_grid", "{boxDimension, dimensions: {width, height}}", "Grid overlay parameters. boxDimension is cell size in pixels, dimensions matches image dimensions. Used for FOV calibration grid.", "Computed by _calculate_and_update_master_grid()"],
            ["9", "building_id", "UUID", "Links to camera_groups (sites) in vcamera PostgreSQL. Gives you the building NAME but NOT a street address.", "User assignment"],
            ["10", "metadata.mapZoom", "int (16–21)", "Suggested Mapbox zoom level. 16 = site-scale (campus), 20–21 = room-scale.", "Frontend auto-set"],
          ]}
        />

        <Divider />

        <SectionHeader>Part 2: Complete Field Inventory (Camera Level)</SectionHeader>
        <SectionDesc>Every field on a CameraLocation entity. Source: calibration_entities.py</SectionDesc>
        <DataTable
          headers={["#", "Field", "Type / Structure", "What It Stores"]}
          rows={[
            ["1", "location", "{lat, lng}", "GPS position of the camera on the floorplan. Derived from pixel position via convert_pos_to_coords(). WGS84."],
            ["2", "px_location", "{x, y}", "Pixel position of the camera on the raster image. Origin is top-left. This is what the user actually dragged."],
            ["3", "angle", "float (degrees, 0–359)", "Camera bearing/orientation in degrees. Set by user drag-rotating the camera icon."],
            ["4", "calibration_event", "{cameraLocChangeTime, calibrationEndTime, ...}", "Timestamps (ms epoch) tracking when the camera was last placed or calibrated."],
          ]}
        />

        <div className="mt-4 rounded-lg border border-sky-500/30 bg-sky-500/10 p-4 text-sm text-sky-300">
          The pixel-to-GPS transform (position_coords_converter.py) runs on every camera placement in production. It uses pixel_metadata (pxPerLat, pxPerLng, centerLat, centerLng) plus image dimensions and rotation to convert pixel (x,y) to WGS84 (lat,lng). This is why 100% of cameras have GPS coordinates.
        </div>

        <Divider />

        <SectionHeader>Part 3: Derivation Chain (How Fields Are Computed)</SectionHeader>
        <CodeBlock lang="plaintext">{`User drops image on Mapbox map
  │
  ├─ User drags corners → bounds {N, S, E, W}          [USER INPUT]
  ├─ User sets rotation → rotation (degrees)             [USER INPUT]
  ├─ Image uploaded     → web_image {s3, dims, ext}      [UPLOAD PIPELINE]
  │
  └─ FloorPlan.perform_calculated_attrs_updates()        [AUTO-COMPUTED]
       │
       ├─ Step 1: _calculate_and_update_bounds()
       │    bounds + rotation + image dims
       │    → calculated_bounds {N, S, E, W}
       │
       ├─ Step 2: _calculate_and_update_pixel_metadata()
       │    calculated_bounds + image dims + rotation
       │    → pixel_metadata {pxPerLat, pxPerLng, centerLat, centerLng}
       │
       ├─ Step 3: _calculate_and_update_floor_plan_loc()
       │    pixel_metadata + image dims + rotation
       │    → fp_location {center, TL, TR, BL, BR as lat/lng}
       │    (calls convert_pos_to_coords for each corner)
       │
       └─ Step 4: _calculate_and_update_master_grid()
            fp_location + web_image + calculated_bounds
            → master_grid {boxDimension, dimensions}

User drags camera icon onto image
  │
  ├─ px_location {x, y}                                  [USER INPUT]
  ├─ angle (degrees)                                     [USER INPUT]
  │
  └─ convert_pos_to_coords(px, image, rotation, pixel_metadata)
       → location {lat, lng}                             [AUTO-COMPUTED]`}</CodeBlock>

        <Divider />

        <SectionHeader>Part 4: Five Real Production Floorplans</SectionHeader>
        <SectionDesc>Diverse sample from Hex (non-deleted, 3+ cameras). All fields populated.</SectionDesc>
        <DataTable
          headers={["Org (Vertical)", "Cams", "File", "Center Lat/Lng", "Rotation", "Scale", "Image px", "Zoom"]}
          rows={SAMPLE_PLANS.map(p => [
            p.label,
            p.cameras.toLocaleString(),
            <span key="file" className="font-mono text-[10px]">{p.file}</span>,
            <span key="ll" className="font-mono text-[10px]">{p.lat.toFixed(4)}, {p.lng.toFixed(4)}</span>,
            `${p.rotation.toFixed(1)}°`,
            p.scale.toFixed(3),
            p.dims,
            p.zoom,
          ])}
        />

        <div className="mt-6">
          <h3 className="text-base font-medium mb-3">Sample Camera Record (from Georgetown ISD plan)</h3>
          <CodeBlock lang="json">{`{
  "cameraid": "a1b2c3d4-...",
  "cameralocation": {
    "angle": 89.0,
    "location": {
      "lat": 30.636320,
      "lng": -97.613195
    },
    "pxLocation": {
      "x": 949.94,
      "y": 1622.96
    }
  }
}`}</CodeBlock>
        </div>

        <Divider />

        <SectionHeader>Part 5: Field-by-Field Transform to vAtlas GeoJSON</SectionHeader>
        <SectionDesc>Target: MapV1 table in PostGIS (EPSG:4326). Single geojson column stores a GeoJSON FeatureCollection.</SectionDesc>
        <DataTable
          headers={["vFootprint Source", "vAtlas Target", "Transform", "Confidence"]}
          rows={[
            ["fp_location (4 corners)", "Feature: type=Polygon, coordinates=[TL, TR, BR, BL, TL]", "Direct. Use fp_location corners as GeoJSON Polygon ring. Close with first point. This IS the rotated image footprint.", <span key="c" className={`rounded border px-2 py-0.5 text-[10px] font-medium ${CONFIDENCE_COLOR.High}`}>High</span>],
            ["fp_location.center", "Feature: type=Point (map center)", "Direct copy. Also usable for reverse-geocoding to get an approximate street address for the Location entity.", <span key="c" className={`rounded border px-2 py-0.5 text-[10px] font-medium ${CONFIDENCE_COLOR.High}`}>High</span>],
            ["camera.location {lat, lng}", "Feature: type=Point, properties={camera_id, angle, device_type}", "Direct. Each camera becomes a GeoJSON Point feature. Angle goes in properties.bearing.", <span key="c" className={`rounded border px-2 py-0.5 text-[10px] font-medium ${CONFIDENCE_COLOR.High}`}>High</span>],
            ["web_image.s3Info", "Raster tile overlay / image reference", "S3 bucket + key provide the source image. Serve as a Mapbox raster tile anchored to the fp_location polygon.", <span key="c" className={`rounded border px-2 py-0.5 text-[10px] font-medium ${CONFIDENCE_COLOR.High}`}>High</span>],
            ["web_image.dimensions", "Image metadata", "Store as properties on the polygon feature. Needed if re-computing pixel positions.", <span key="c" className={`rounded border px-2 py-0.5 text-[10px] font-medium ${CONFIDENCE_COLOR.High}`}>High</span>],
            ["pixel_metadata", "properties on polygon feature", "Store for backward compatibility. Enables re-deriving pixel coords from GPS if needed. Not required for GeoJSON rendering.", <span key="c" className={`rounded border px-2 py-0.5 text-[10px] font-medium ${CONFIDENCE_COLOR.Medium}`}>Medium</span>],
            ["rotation", "properties.rotation on polygon", "Redundant if fp_location corners are used. Store for reference. Normalize to 0–360 first.", <span key="c" className={`rounded border px-2 py-0.5 text-[10px] font-medium ${CONFIDENCE_COLOR.Medium}`}>Medium</span>],
            ["bounds / calculated_bounds", "bbox property on FeatureCollection", "Use calculated_bounds as the GeoJSON bbox [west, south, east, north]. Useful for spatial indexing.", <span key="c" className={`rounded border px-2 py-0.5 text-[10px] font-medium ${CONFIDENCE_COLOR.High}`}>High</span>],
            ["building_id", "Building (L3) entity reference", "Look up name from camera_groups. Create Building entity in Maps. No address available here.", <span key="c" className={`rounded border px-2 py-0.5 text-[10px] font-medium ${CONFIDENCE_COLOR.Medium}`}>Medium</span>],
            ["floor_id", "Floor (L4) entity reference", "Create Floor entity under Building. Name from camera_groups sub-site if available.", <span key="c" className={`rounded border px-2 py-0.5 text-[10px] font-medium ${CONFIDENCE_COLOR.Medium}`}>Medium</span>],
            ["metadata.mapZoom", "properties.defaultZoom", "Direct. Controls initial view when user opens this map.", <span key="c" className={`rounded border px-2 py-0.5 text-[10px] font-medium ${CONFIDENCE_COLOR.High}`}>High</span>],
            ["master_grid", "Not migrated", "Internal to FOV calibration pipeline. Not needed in Maps.", <span key="c" className={`rounded border px-2 py-0.5 text-[10px] font-medium ${CONFIDENCE_COLOR["N/A"]}`}>N/A</span>],
            ["camera.px_location", "properties.pxLocation on Point feature", "Store for backward compat. Not needed for GeoJSON rendering but useful for debugging.", <span key="c" className={`rounded border px-2 py-0.5 text-[10px] font-medium ${CONFIDENCE_COLOR.Low}`}>Low</span>],
            ["camera.calibration_event", "properties.lastModified on Point feature", "Use cameraLocChangeTime as a last-modified timestamp. Not geo data.", <span key="c" className={`rounded border px-2 py-0.5 text-[10px] font-medium ${CONFIDENCE_COLOR.Low}`}>Low</span>],
          ]}
        />

        <Divider />

        <SectionHeader>Part 6: Example Output GeoJSON</SectionHeader>
        <SectionDesc>What a single migrated floorplan looks like in the vAtlas maps_v1.geojson column.</SectionDesc>
        <CodeBlock lang="json">{`{
  "type": "FeatureCollection",
  "bbox": [-97.61391, 30.63597, -97.61248, 30.63688],
  "features": [
    {
      "type": "Feature",
      "id": "floorplan:04e715d6-aa26-4c9c-b3d8-8c2460981f39",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-97.61361, 30.63597],
          [-97.61248, 30.63628],
          [-97.61278, 30.63688],
          [-97.61391, 30.63657],
          [-97.61361, 30.63597]
        ]]
      },
      "properties": {
        "featureType": "floorplan",
        "name": "GAP-Cameras-Doors",
        "buildingId": "67c9d848-8ce0-4ce9-b0f7-cfbb84e89b6d",
        "floorId": "26d4fc68-3faa-43e2-910a-3490874d6be5",
        "imageUrl": "s3://verkada-floor-plans-prod1/processed/04e715d6-...-1772115948463.png",
        "imageDimensions": { "width": 15018, "height": 10800 },
        "rotation": -20.53,
        "scale": 0.031,
        "defaultZoom": 19
      }
    },
    {
      "type": "Feature",
      "id": "camera:a1b2c3d4-...",
      "geometry": {
        "type": "Point",
        "coordinates": [-97.61320, 30.63632]
      },
      "properties": {
        "featureType": "device",
        "deviceType": "camera",
        "cameraId": "a1b2c3d4-...",
        "bearing": 89.0,
        "pxLocation": { "x": 949.94, "y": 1622.96 }
      }
    }
  ]
}`}</CodeBlock>

        <Divider />

        <SectionHeader>Part 7: What Does NOT Exist in Floorplans</SectionHeader>
        <DataTable
          headers={["Missing Data", "Where People Assume It Is", "Reality"]}
          rows={[
            ["Street address", "vFootprint or camera_groups", "Neither stores addresses. camera_groups has name and org_id only. Must reverse-geocode from fp_location.center."],
            ["Site Planner location data", "Shared with Floorplans", "Completely separate product. Site Planner has location_latitude, location_longitude, location_address per project, but no join key to vFootprint building_id."],
            ["Wall/room GeoJSON polygons", "Derivable from pixel data", "Walls are stored as pixel line segments (Wall entities with position_1, position_2 in px coords). Could be converted using pixel_metadata, but not structured as rooms/polygons."],
            ["Device type beyond camera", "Floorplans data", "vFootprint only stores camera placements. Other device types (doors, sensors, alarms) are NOT in the DynamoDB tables."],
            ["FOV polygon geometry", "mastergridfieldofview column", "Column only has processing status flags. Actual FOV polygons are computed downstream and stored separately (or not at all in DynamoDB)."],
          ]}
        />

        <footer className="mt-20 pt-6 border-t border-border text-xs text-muted-foreground">
          Ankush Rustagi · Verkada Product · Last updated May 14, 2026. Data source: Hex thread 019e255c. Backend code: Verkada-Backend/vfloorplans/
        </footer>
      </main>
    </div>
  )
}
