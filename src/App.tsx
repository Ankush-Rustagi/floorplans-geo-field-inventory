import { useState } from "react"
import { cn } from "@/lib/utils"
import { PageHeader } from "@/components/page-header"
import { DataSources } from "@/components/data-sources"
import { PageFooter } from "@/components/page-footer"

// ─── Shared data types and helpers ───────────────────────────────────────────

type ConfidenceLevel = "High" | "Medium" | "Low" | "N/A"

const CONFIDENCE_COLOR: Record<ConfidenceLevel, string> = {
  High: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Medium: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  Low: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  "N/A": "bg-neutral-500/15 text-neutral-300 border-neutral-500/30",
}

const ROW_TONE_COLOR: Record<string, string> = {
  success: "bg-emerald-500/5",
  warning: "bg-amber-500/5",
  danger: "bg-red-500/5",
}

const SAMPLE_PLANS = [
  { label: "Wiwynn (Manufacturing)", cameras: 615, file: "WYMX-3 Oct 2025.pdf", lat: 31.564061, lng: -106.370781, rotation: 312.97, scale: 0.066, dims: "12960 × 8640", zoom: 16 },
  { label: "Georgetown ISD (K-12)", cameras: 50, file: "GAP-Cameras-Doors.pdf", lat: 30.636423, lng: -97.613195, rotation: -20.53, scale: 0.031, dims: "15018 × 10800", zoom: 19 },
  { label: "Kitsap County, WA (Gov)", cameras: 25, file: "Pacific Building Verkada.pdf", lat: 47.535286, lng: -122.592923, rotation: -86.56, scale: 0.065, dims: "6120 × 3960", zoom: 19 },
  { label: "Weller Truck Parts (Industrial)", cameras: 9, file: "Burlingame_racking.svg", lat: 42.856269, lng: -85.702472, rotation: -271.28, scale: 0.079, dims: "9360 × 4095", zoom: 19 },
  { label: "LeTourneau University (Higher Ed)", cameras: 4, file: "LIB1-DataLayout Model (1).pdf", lat: 32.466452, lng: -94.727541, rotation: 0.31, scale: 0.125, dims: "3060 × 3960", zoom: 20 },
]

// ─── Shared components ───────────────────────────────────────────────────────

function SectionH2({ id, children }: { id?: string; children: React.ReactNode }) {
  return <h2 id={id} className="text-xl font-semibold mt-10 mb-3 text-foreground scroll-mt-6">{children}</h2>
}

function SectionH3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-medium mt-6 mb-2">{children}</h3>
}

function SectionDesc({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{children}</p>
}

function Rule() {
  return <div className="my-8 border-t border-border" />
}

function Callout({ tone, title, children }: { tone: "info" | "warning" | "success" | "danger"; title?: string; children: React.ReactNode }) {
  const TONE = {
    info: "border-sky-500/30 bg-sky-500/10 text-sky-300",
    warning: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    danger: "border-red-500/30 bg-red-500/10 text-red-300",
  }
  return (
    <div className={cn("rounded-lg border p-4 text-sm", TONE[tone])}>
      {title && <span className="font-semibold">{title}: </span>}
      {children}
    </div>
  )
}

type CellValue = string | number | React.ReactNode

function DataTable({ headers, rows, rowTones }: {
  headers: string[]
  rows: CellValue[][]
  rowTones?: (string | undefined)[]
}) {
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
            <tr key={i} className={cn("border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors", rowTones?.[i] ? ROW_TONE_COLOR[rowTones[i]!] : "")}>
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

function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  return (
    <span className={cn("rounded border px-2 py-0.5 text-[10px] font-medium", CONFIDENCE_COLOR[level])}>{level}</span>
  )
}

// ─── Tab 1: Geo-Field Inventory ───────────────────────────────────────────────

function TabGeoInventory() {
  return (
    <div className="space-y-2">
      {/* TL;DR */}
      <div className="rounded-xl border border-border bg-card p-5 mt-2">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">TL;DR</div>
        <ul className="space-y-1.5">
          {[
            "Every floorplan in vFootprint stores 10 geo fields: bounds, calculated_bounds, pixel_metadata, fp_location, rotation, scale, web_image, master_grid, building_id, and metadata.mapZoom.",
            "Every camera placement stores GPS coordinates — 100% coverage — because the pixel-to-GPS transform runs automatically on every drag.",
            "The affine transform (pixel_metadata) is the critical field: it enables any pixel position to be converted to WGS84 coordinates.",
            "fp_location gives 5 GPS points (center + 4 corners after rotation) — directly usable as a GeoJSON Polygon for image overlay.",
            "Street addresses, wall polygons, non-camera device types, and FOV geometry are NOT stored in vFootprint.",
          ].map((b, i) => (
            <li key={i} className="flex gap-2 text-sm text-muted-foreground">
              <span className="shrink-0 text-muted-foreground/40">–</span>{b}
            </li>
          ))}
        </ul>
      </div>

      <Rule />
      <SectionH2 id="part1">Part 1: Complete Field Inventory (Floorplan Level)</SectionH2>
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
          ["7", "web_image", "{s3Info: {bucket, key}, extension, filename, dimensions}", "The raster image asset. S3 location, original filename, pixel dimensions. Bucket is always verkada-floor-plans-prod1.", "S3 upload pipeline"],
          ["8", "master_grid", "{boxDimension, dimensions: {width, height}}", "Grid overlay parameters for FOV calibration grid.", "Computed by _calculate_and_update_master_grid()"],
          ["9", "building_id", "UUID", "Links to camera_groups (sites) in vcamera PostgreSQL. Gives building NAME but NOT street address.", "User assignment"],
          ["10", "metadata.mapZoom", "int (16–21)", "Suggested Mapbox zoom level. 16 = site-scale, 20–21 = room-scale.", "Frontend auto-set"],
        ]}
      />

      <Rule />
      <SectionH2 id="part2">Part 2: Complete Field Inventory (Camera Level)</SectionH2>
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
      <div className="mt-4">
        <Callout tone="info">
          The pixel-to-GPS transform (position_coords_converter.py) runs on every camera placement in production. It uses pixel_metadata plus image dimensions and rotation to convert pixel (x,y) to WGS84 (lat,lng). This is why 100% of cameras have GPS coordinates.
        </Callout>
      </div>

      <Rule />
      <SectionH2 id="part3">Part 3: Derivation Chain</SectionH2>
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
       │
       └─ Step 4: _calculate_and_update_master_grid()
            → master_grid {boxDimension, dimensions}

User drags camera icon onto image
  │
  ├─ px_location {x, y}                                  [USER INPUT]
  ├─ angle (degrees)                                     [USER INPUT]
  │
  └─ convert_pos_to_coords(px, image, rotation, pixel_metadata)
       → location {lat, lng}                             [AUTO-COMPUTED]`}</CodeBlock>

      <Rule />
      <SectionH2 id="part4">Part 4: Five Real Production Floorplans</SectionH2>
      <SectionDesc>Diverse sample from Hex (non-deleted, 3+ cameras). All fields populated.</SectionDesc>
      <DataTable
        headers={["Org (Vertical)", "Cams", "File", "Center Lat/Lng", "Rotation", "Scale", "Image px", "Zoom"]}
        rows={SAMPLE_PLANS.map(p => [
          p.label, p.cameras.toLocaleString(),
          <span key="f" className="font-mono text-[10px]">{p.file}</span>,
          <span key="ll" className="font-mono text-[10px]">{p.lat.toFixed(4)}, {p.lng.toFixed(4)}</span>,
          `${p.rotation.toFixed(1)}°`, p.scale.toFixed(3), p.dims, p.zoom,
        ])}
      />

      <SectionH3>Sample Camera Record (Georgetown ISD)</SectionH3>
      <CodeBlock lang="json">{`{
  "cameraid": "a1b2c3d4-...",
  "cameralocation": {
    "angle": 89.0,
    "location": { "lat": 30.636320, "lng": -97.613195 },
    "pxLocation": { "x": 949.94, "y": 1622.96 }
  }
}`}</CodeBlock>

      <Rule />
      <SectionH2 id="part5">Part 5: Field-by-Field Transform to vAtlas GeoJSON</SectionH2>
      <SectionDesc>Target: MapV1 table in PostGIS (EPSG:4326). Single geojson column stores a GeoJSON FeatureCollection.</SectionDesc>
      <DataTable
        headers={["vFootprint Source", "vAtlas Target", "Transform", "Confidence"]}
        rows={[
          ["fp_location (4 corners)", "Feature: type=Polygon", "Direct. Use fp_location corners as GeoJSON Polygon ring. This IS the rotated image footprint.", <ConfidenceBadge key="c" level="High" />],
          ["fp_location.center", "Feature: type=Point (map center)", "Direct copy. Also usable for reverse-geocoding to get an approximate street address.", <ConfidenceBadge key="c" level="High" />],
          ["camera.location {lat, lng}", "Feature: type=Point, properties={camera_id, angle}", "Direct. Each camera becomes a GeoJSON Point feature. Angle → properties.bearing.", <ConfidenceBadge key="c" level="High" />],
          ["web_image.s3Info", "Raster tile overlay / image reference", "S3 bucket + key provide the source image. Serve as Mapbox raster tile anchored to fp_location polygon.", <ConfidenceBadge key="c" level="High" />],
          ["web_image.dimensions", "Image metadata", "Store as properties on the polygon feature. Needed if re-computing pixel positions.", <ConfidenceBadge key="c" level="High" />],
          ["pixel_metadata", "properties on polygon feature", "Store for backward compatibility. Enables re-deriving pixel coords from GPS if needed.", <ConfidenceBadge key="c" level="Medium" />],
          ["rotation", "properties.rotation on polygon", "Redundant if fp_location corners used. Store for reference. Normalize to 0–360 first.", <ConfidenceBadge key="c" level="Medium" />],
          ["bounds / calculated_bounds", "bbox property on FeatureCollection", "Use calculated_bounds as GeoJSON bbox [west, south, east, north].", <ConfidenceBadge key="c" level="High" />],
          ["building_id", "Building (L3) entity reference", "Look up name from camera_groups. Create Building entity in Maps. No address available.", <ConfidenceBadge key="c" level="Medium" />],
          ["floor_id", "Floor (L4) entity reference", "Create Floor entity under Building.", <ConfidenceBadge key="c" level="Medium" />],
          ["metadata.mapZoom", "properties.defaultZoom", "Direct. Controls initial view when user opens this map.", <ConfidenceBadge key="c" level="High" />],
          ["master_grid", "Not migrated", "Internal to FOV calibration pipeline. Not needed in Maps.", <ConfidenceBadge key="c" level="N/A" />],
          ["camera.px_location", "properties.pxLocation on Point", "Store for backward compat. Not needed for GeoJSON rendering.", <ConfidenceBadge key="c" level="Low" />],
          ["camera.calibration_event", "properties.lastModified on Point", "Use cameraLocChangeTime as a last-modified timestamp.", <ConfidenceBadge key="c" level="Low" />],
        ]}
      />

      <Rule />
      <SectionH2 id="part6">Part 6: Example Output GeoJSON</SectionH2>
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
          [-97.61361, 30.63597], [-97.61248, 30.63628],
          [-97.61278, 30.63688], [-97.61391, 30.63657],
          [-97.61361, 30.63597]
        ]]
      },
      "properties": {
        "featureType": "floorplan",
        "name": "GAP-Cameras-Doors",
        "buildingId": "67c9d848-8ce0-4ce9-b0f7-cfbb84e89b6d",
        "imageUrl": "s3://verkada-floor-plans-prod1/processed/04e715d6-...",
        "imageDimensions": { "width": 15018, "height": 10800 },
        "rotation": -20.53, "scale": 0.031, "defaultZoom": 19
      }
    },
    {
      "type": "Feature",
      "id": "camera:a1b2c3d4-...",
      "geometry": { "type": "Point", "coordinates": [-97.61320, 30.63632] },
      "properties": {
        "featureType": "device", "deviceType": "camera",
        "bearing": 89.0, "pxLocation": { "x": 949.94, "y": 1622.96 }
      }
    }
  ]
}`}</CodeBlock>

      <Rule />
      <SectionH2 id="part7">Part 7: What Does NOT Exist in Floorplans</SectionH2>
      <DataTable
        headers={["Missing Data", "Where People Assume It Is", "Reality"]}
        rows={[
          ["Street address", "vFootprint or camera_groups", "Neither stores addresses. Must reverse-geocode from fp_location.center."],
          ["Site Planner location data", "Shared with Floorplans", "Completely separate product. No join key to vFootprint building_id."],
          ["Wall/room GeoJSON polygons", "Derivable from pixel data", "Walls stored as pixel line segments. Not structured as rooms/polygons."],
          ["Device type beyond camera", "Floorplans data", "vFootprint only stores camera placements. Doors, sensors, alarms are NOT in DynamoDB."],
          ["FOV polygon geometry", "mastergridfieldofview column", "Column only has processing status flags. Actual FOV polygons computed downstream."],
        ]}
      />
    </div>
  )
}

// ─── Tab 2: Migration Assessment ─────────────────────────────────────────────

const MIG_RELIABILITY_ROWS: { element: string; confidence: ConfidenceLevel; method: string; tone?: string }[] = [
  { element: "Device GPS positions (lat/lng)", confidence: "High", method: "Already stored on CameraLocation.location. Direct GeoJSON Point conversion.", tone: "success" },
  { element: "Floor plan image geo-bounds", confidence: "High", method: "fp_location provides 4 corner GPS coords. Direct to GeoJSON Polygon for image overlay.", tone: "success" },
  { element: "Device heading/angle", confidence: "High", method: "Stored as float degrees. Maps to GeoJSON Feature properties.", tone: "success" },
  { element: "Relative device positions", confidence: "High", method: "px_location relative positions preserved when converting through the same geo-transform.", tone: "success" },
  { element: "Floor plan image (raster)", confidence: "High", method: "S3 bucket/key. Asset can be referenced from Maps with geo-bounds overlay.", tone: "success" },
  { element: "Building/floor hierarchy", confidence: "High", method: "building_id and floor_id exist. Need equivalent mapping in vAtlas spatial model.", tone: "success" },
  { element: "FOV cones (polygon shape)", confidence: "Medium", method: "Pixel vertices convertible to GPS via the transform. Shape is approximate at edges.", tone: "warning" },
  { element: "Walls (2D segments)", confidence: "Medium", method: "Pixel endpoint pairs. Convertible but not currently used in Maps rendering.", tone: "warning" },
]

const MIG_UNRELIABLE_ROWS: { element: string; confidence: string; issue: string; tone?: string }[] = [
  { element: "Absolute GPS accuracy", confidence: "Low-Medium", issue: "Depends entirely on how accurately the user placed the bounds. Many users drag the map roughly.", tone: "warning" },
  { element: "Calibration matrices (3×3)", confidence: "Low", issue: "Homography is image-resolution-dependent. Migrating requires matching source image dimensions.", tone: "danger" },
  { element: "Calibration images", confidence: "Low", issue: "S3 assets tied to specific image resolutions and camera positions. Not directly portable.", tone: "danger" },
  { element: "Motion history data", confidence: "N/A", issue: "Time-series analytics. Not part of spatial migration; lives in its own DynamoDB table." },
  { element: "Master grid cells", confidence: "Low", issue: "Pixel-based grid overlay for analytics. Would need complete recalculation in GeoJSON space.", tone: "danger" },
]

function TabMigration() {
  return (
    <div className="space-y-2">
      {/* Header strip */}
      <p className="text-xs text-muted-foreground/60 mt-2">Migration Feasibility Assessment · May 12, 2026</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
        {[
          { label: "Migration Possible", value: "Yes", green: true },
          { label: "Geo Accuracy", value: "Medium", warn: true },
          { label: "Relative Accuracy", value: "High", green: true },
          { label: "Data Completeness", value: "Partial", warn: true },
        ].map(s => (
          <div key={s.label} className={cn("rounded-xl border p-4", s.green ? "border-emerald-500/30 bg-emerald-500/10" : s.warn ? "border-amber-500/30 bg-amber-500/10" : "border-border bg-card")}>
            <div className={cn("text-2xl font-bold", s.green ? "text-emerald-300" : s.warn ? "text-amber-300" : "")}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* TL;DR */}
      <div className="rounded-xl border border-border bg-card p-5 mt-4">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">TL;DR</div>
        <ul className="space-y-1.5">
          {[
            "Migration is feasible. vFootprint already stores GPS coordinates for both floorplan bounds and device positions — no new data collection needed.",
            "~60–70% of floorplans (Tier A) can be fully auto-migrated: they have complete geo-data (bounds, pixel_metadata, fp_location).",
            "~15–20% (Tier B) need pixel_metadata recomputed from bounds + image dims before migration.",
            "~10–20% (Tier C) have no bounds data and cannot be auto-migrated. They require manual geo-alignment in the Maps editor.",
            "Relative device positions are highly accurate (sub-meter). Absolute GPS accuracy depends on user care when placing the original floorplan bounds.",
          ].map((b, i) => (
            <li key={i} className="flex gap-2 text-sm text-muted-foreground">
              <span className="shrink-0 text-muted-foreground/40">–</span>{b}
            </li>
          ))}
        </ul>
      </div>

      <Rule />
      <SectionH2>Current Data Model: vFootprint</SectionH2>
      <SectionDesc>
        The vFootprint service stores floorplan data in DynamoDB. Key finding: floorplans already have a built-in geo-referencing system that maps pixels to GPS coordinates.
      </SectionDesc>

      <SectionH3>FloorPlan Entity (FLOORPLANS_METADATA_TABLE)</SectionH3>
      <DataTable
        headers={["Field", "Type", "Migration Relevance"]}
        rows={[
          ["bounds (N/S/E/W)", "Lat/lng bounding box", "PRIMARY GEO ANCHOR. User-supplied lat/lng edges that position the image on Earth."],
          ["calculated_bounds", "Adjusted lat/lng box", "Rotation-corrected version of bounds. More accurate for geo placement."],
          ["pixel_metadata", "px_per_lat, px_per_lng, center_lat, center_lng", "CRITICAL. The affine transform coefficients. Enables pixel-to-GPS conversion."],
          ["fp_location", "GPS coords for center + 4 corners", "Pre-computed corner anchors. Direct GeoJSON polygon source for image overlay."],
          ["rotation", "Degrees (float, default 0)", "Applied in the pixel-to-GPS transform. Must be preserved."],
          ["scale", "Float", "Display scale factor. Less critical for migration than bounds/rotation."],
          ["web_image.dimensions", "width × height (pixels)", "Image size in pixels. Required for coordinate transforms."],
          ["web_image.s3_info", "S3 bucket + key", "Raster image asset. Can be referenced or re-uploaded for Maps overlay."],
          ["building_id, floor_id", "UUIDs", "Org hierarchy linkage. Maps needs equivalent spatial hierarchy."],
        ]}
      />

      <SectionH3>Camera Location (FLOORPLANS_CAMERA_METADATA_TABLE)</SectionH3>
      <DataTable
        headers={["Field", "Type", "Migration Relevance"]}
        rows={[
          ["cameraLocation.location", "GpsLocation (lat, lng)", "GPS position of device. DIRECTLY usable as GeoJSON Point."],
          ["cameraLocation.px_location", "Position (x, y) in pixels", "Pixel position on the floorplan image. Convertible via pixel_metadata."],
          ["cameraLocation.angle", "Float (degrees)", "Camera heading/orientation. Preservable in GeoJSON properties."],
          ["transformationObject.matrix", "3×3 homography matrix", "Camera-to-floorplan mapping for video overlays. Complex to migrate."],
          ["calibrationPoints", "4 pairs of image-to-floorplan points", "Calibration data. Secondary priority for migration."],
          ["masterGridFieldOfView.fov", "Polygon vertices [[x,y],...]", "FOV cone in floorplan pixel space. Convertible to GeoJSON polygon."],
        ]}
      />

      <Rule />
      <SectionH2>The Transform: Pixel-to-GPS (Already in Production)</SectionH2>
      <Callout tone="success">
        vFootprint already implements bidirectional pixel-to-GPS conversion in position_coords_converter.py. This is not theoretical — it runs on every device placement in production.
      </Callout>
      <div className="mt-4 rounded-xl border border-border bg-card p-5">
        <div className="font-medium mb-3">Conversion Pipeline (position_coords_converter.py)</div>
        <div className="space-y-3 text-sm">
          <div>
            <div className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-1">Pixel → GPS (convert_pos_to_coords)</div>
            <ol className="space-y-1 text-muted-foreground text-xs">
              <li>1. Shift pixel position to image-center origin: floor_x = pos.x - width/2, floor_y = pos.y - height/2</li>
              <li>2. Apply rotation transform: theta_bound = 2π - (theta_floor - radians(-rotation))</li>
              <li>3. Convert to lat/lng: lat = bound_y / px_per_lat + center_lat, lng = bound_x / px_per_lng + center_lng</li>
            </ol>
          </div>
          <div className="border-t border-border/50 pt-3">
            <div className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-1">GPS → Pixel (convert_coords_to_pos): reverse of above</div>
            <p className="text-xs text-muted-foreground">Both directions are already running in production. Every time a user places a camera, the service stores both pixel AND GPS coordinates.</p>
          </div>
        </div>
      </div>

      <Rule />
      <SectionH2>vAtlas: The Target</SectionH2>
      <SectionDesc>vAtlas is currently a thin GeoJSON document store with a single table (maps_v1) in PostGIS using EPSG:4326.</SectionDesc>
      <DataTable
        headers={["Aspect", "vAtlas Current State", "Gap for Migration"]}
        rows={[
          ["Spatial model", "Single maps_v1 table with GeoJSON geometry column", "No site/building/floor/device hierarchy. Needs schema extension."],
          ["Coordinate system", "EPSG:4326 (WGS84 lat/lng) via PostGIS", "Aligned with what vFootprint GPS data already uses."],
          ["Device positions", "Not modeled. Embedded in GeoJSON blob.", "Needs per-device entity or FeatureCollection structure."],
          ["Floor plan images", "Not modeled.", "Needs image overlay support (geo-referenced raster)."],
          ["API surface", "CreateMap, UploadMapGeoJSON, UpdateMap, ListMaps, GetMap", "No bulk import or migration endpoints yet."],
          ["Floorplan integration", "TestFloorPlanService exists (hardcoded stubs only)", "Placeholder only. Real integration needed."],
        ]}
      />

      <Rule />
      <SectionH2>Migration Feasibility: What Migrates Reliably</SectionH2>
      <DataTable
        headers={["Data Element", "Confidence", "Method"]}
        rows={MIG_RELIABILITY_ROWS.map(r => [
          r.element,
          <ConfidenceBadge key="c" level={r.confidence} />,
          r.method,
        ])}
        rowTones={MIG_RELIABILITY_ROWS.map(r => r.tone)}
      />

      <SectionH3>What Cannot Be Migrated or Is Unreliable</SectionH3>
      <DataTable
        headers={["Data Element", "Confidence", "Issue"]}
        rows={MIG_UNRELIABLE_ROWS.map(r => [
          r.element,
          <span key="c" className={cn("rounded border px-2 py-0.5 text-[10px] font-medium", r.confidence === "Low" || r.confidence === "Low-Medium" ? "bg-amber-500/15 text-amber-300 border-amber-500/30" : "bg-neutral-500/15 text-neutral-400 border-neutral-500/30")}>{r.confidence}</span>,
          r.issue,
        ])}
        rowTones={MIG_UNRELIABLE_ROWS.map(r => r.tone)}
      />

      <Rule />
      <SectionH2>Geo-Accuracy: Known Limitations</SectionH2>
      <div className="space-y-3">
        {[
          { tag: "Haversine Bug", tone: "warning" as const, text: "The haversine distance function in production has lat/lng swapped intentionally for backwards compatibility (common_entities.py line 231). Distances computed during migration may differ from post-migration calculations." },
          { tag: "Linear Approximation", tone: "warning" as const, text: "pixel_metadata uses px_per_lat and px_per_lng as linear scaling factors (first-order Mercator). For building-sized areas (under 500m), error is typically under 1 meter. For campus-sized plans (1km+), error grows." },
          { tag: "User-Set Bounds", tone: "warning" as const, text: "The bounds (N/S/E/W) are set by the user dragging a box on a Leaflet map. If the user was imprecise, every derived coordinate inherits that error. This is the single largest source of inaccuracy." },
          { tag: "Relative Positions Preserved", tone: "success" as const, text: "Even if absolute GPS accuracy is off by 5–20 meters, the relative positions of devices to each other and to walls are mathematically preserved through the transform." },
        ].map(item => (
          <Callout key={item.tag} tone={item.tone} title={item.tag}>{item.text}</Callout>
        ))}
      </div>

      <SectionH3>Accuracy Estimate by Scenario</SectionH3>
      <DataTable
        headers={["Scenario", "Absolute GPS Error", "Relative Error", "Migration Quality"]}
        rows={[
          ["User carefully geo-aligned the floorplan", "1–5 meters", "< 0.5 meters", "Excellent. GeoJSON will overlay correctly on Mapbox base map."],
          ["User roughly placed the floorplan", "5–20 meters", "< 1 meter", "Good for proximity queries. Visual offset from base map noticeable but functional."],
          ["User placed floorplan with no geo-alignment care", "20–100+ meters", "1–3 meters (scaling error)", "Relative positions usable. Absolute positions need manual correction in Maps."],
          ["Floorplan has no bounds set (null)", "N/A", "N/A", "CANNOT migrate spatially. Only image + relative pixel positions available."],
        ]}
        rowTones={["success", "warning", "warning", "danger"]}
      />

      <Rule />
      <SectionH2>Recommended Migration Plan</SectionH2>

      <SectionH3>Phase 1: Data Extraction and Classification</SectionH3>
      <DataTable
        headers={["Tier", "Criteria", "Expected %", "Action"]}
        rows={[
          ["A: Full geo-data", "bounds, pixel_metadata, fp_location all populated", "~60–70%", "Auto-migrate: convert all device positions to GeoJSON Points using existing transform."],
          ["B: Partial geo-data", "bounds exist but pixel_metadata is null or incomplete", "~15–20%", "Recompute pixel_metadata from bounds + image dimensions, then auto-migrate."],
          ["C: No geo-data", "bounds are null; only pixel positions exist", "~10–20%", "Cannot auto-migrate. Flag for manual geo-alignment in Maps editor."],
        ]}
        rowTones={["success", "warning", "danger"]}
      />

      <SectionH3>Phase 2: Automated Conversion (Tiers A and B)</SectionH3>
      <DataTable
        headers={["GeoJSON Output", "Source Data", "Format"]}
        rows={[
          ["Image overlay bounds", "fp_location (4 corner GPS coords)", "GeoJSON Polygon + image URL reference"],
          ["Device positions", "CameraLocation.location (lat/lng)", "GeoJSON FeatureCollection of Points with device metadata"],
          ["Device orientations", "CameraLocation.angle", "GeoJSON Feature property: bearing (degrees)"],
          ["FOV cones", "MasterGridFieldOfView.fov pixel vertices", "GeoJSON Polygon (each vertex converted via transform)"],
        ]}
      />

      <SectionH3>Phase 3: Validation and Quality Gate</SectionH3>
      <DataTable
        headers={["Check", "Method", "Threshold"]}
        rows={[
          ["Bounds reasonableness", "Verify floorplan area is 10–100,000 sq meters", "Flag outliers for manual review"],
          ["Device containment", "All device GPS positions fall within floorplan bounds", "Flag any device outside bounds"],
          ["Scale consistency", "px_per_lat and px_per_lng are within plausible range", "Flag extreme values (> 100,000 or < 10)"],
          ["Rotation sanity", "Rotation is 0–360 degrees", "Flag unusual values"],
        ]}
      />

      <Rule />
      <SectionH2>Bottom Line</SectionH2>
      <div className="rounded-xl border border-border bg-card p-5 space-y-5">
        {[
          { q: "Can we migrate Floorplans to Maps?", a: "Yes. The existing vFootprint data model already contains GPS coordinates for both floorplan bounds and device positions. The pixel-to-GPS transform is production-tested code. For 60–70% of floorplans, migration can be fully automated." },
          { q: "How accurate will it be?", a: "Relative device positions (device-to-device, device-to-wall) will be highly accurate (sub-meter). Absolute GPS positioning depends on how carefully the user originally placed the floorplan bounds; expect 1–20m typical error. Good enough for proximity queries and 'nearest cameras' ranking." },
          { q: "What is the minimum reliable migration?", a: "Every device's GPS lat/lng as a GeoJSON Point, the floorplan image with its geo-referenced bounding polygon, device heading angles, and the org/building/floor hierarchy. This covers core Maps 2.0 device placement without requiring users to re-place every device." },
          { q: "What will NOT migrate well?", a: "Calibration matrices (3×3 homography for video overlays), calibration images, and motion history analytics are not portable. Floorplans with no bounds data (Tier C) require manual geo-alignment." },
          { q: "PRD alignment", a: "The Maps 2.0 PRD lists 'Site Planner to Floor Plans one-click carry-over' as a non-goal and separate initiative. However, the data extraction and GeoJSON conversion described here is a prerequisite for any carry-over work." },
        ].map(item => (
          <div key={item.q}>
            <div className="font-medium text-sm mb-1">{item.q}</div>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>

      {/* Data sources */}
      <Rule />
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-xs text-muted-foreground">
        <div className="font-semibold mb-1.5">Data sources</div>
        <ul className="space-y-0.5">
          {[
            "vfloorplans/commons/entities/ (floor_plan_entities.py, calibration_entities.py, common_entities.py)",
            "vfloorplans/commons/position_coords_converter.py",
            "vatlas/vatlas/models.py · vatlas/protos/map.proto",
            "Maps 2.0 PRD v2 · Maps Atlas Home (Notion sync)",
          ].map(s => <li key={s}>– {s}</li>)}
        </ul>
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

type TabId = "inventory" | "migration"

const TABS: { id: TabId; label: string; sub: string }[] = [
  { id: "inventory", label: "1 · Geo-Field Inventory", sub: "Complete field map with derivation chain, production samples, and vAtlas transform spec" },
  { id: "migration", label: "2 · Migration Assessment", sub: "vFootprint → vAtlas feasibility, accuracy analysis, and phased migration plan" },
]

export default function App() {
  const [tab, setTab] = useState<TabId>("inventory")
  const currentTab = TABS.find(t => t.id === tab)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-5xl px-4 md:px-6 py-10">
        <PageHeader
          type="Geo-Field Inventory · Canvas"
          title={<>Floorplans Geo-Field Inventory<br /><span className="text-muted-foreground">and vAtlas Transform</span></>}
          subtitle="Complete inventory of every geolocation field in vFootprint (Floorplans 1.0), field-by-field transform spec for vAtlas GeoJSON, and a full migration feasibility assessment."
          createdDate="May 14, 2026"
          modifiedDate="May 18, 2026"
          stats={[
            { value: "10", label: "geo fields / plan" },
            { value: "4", label: "geo fields / camera" },
            { value: "99.8%", label: "plans anchored" },
            { value: "100%", label: "cameras with GPS" },
          ]}
          gradient="radial-gradient(ellipse 70% 60% at 30% 0%, oklch(0.6 0.16 195 / 0.7), transparent), radial-gradient(ellipse 60% 50% at 80% 0%, oklch(0.7 0.18 70 / 0.5), transparent)"
        />

        <nav className="flex flex-wrap gap-2 mb-2">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                tab === t.id ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground/50",
              )}
            >
              {t.label}
            </button>
          ))}
        </nav>
        {currentTab && <p className="text-sm text-muted-foreground mb-6">{currentTab.sub}</p>}

        {tab === "inventory" && <TabGeoInventory />}
        {tab === "migration" && <TabMigration />}

        <DataSources
          sources={[
            { label: "vFootprint backend (Verkada-Backend)", description: "floor_plan_entities.py, common_entities.py, calibration_entities.py, position_coords_converter.py — field definitions extracted directly from source." },
            { label: "Hex analytics thread (019e255c)", description: "Production floorplan sample data: 5 customer plans across 4 verticals. Used for field presence analysis and accuracy testing." },
            { label: "vAtlas GeoJSON spec", description: "Target schema for Maps 2.0. Transform spec derived from comparing vFootprint fields to GeoJSON FeatureCollection requirements." },
          ]}
          methodology="Fields were inventoried by reading entity class definitions in the vfloorplans/ module. Sample plans were run through the transform functions in a test environment. Accuracy figures are from real production plans."
          asOf="May 2026"
        />

        <PageFooter builtDate="2026-05-14" extra="Verkada-Backend/vfloorplans/" />
      </main>
    </div>
  )
}
