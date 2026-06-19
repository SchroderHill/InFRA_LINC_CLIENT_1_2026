# InFRA LINC Netlify Deploy

Clean static deploy copy for the InFRA LINC estate dashboard.

## Local preview

Use VS Code Live Server or another local HTTP server from this folder:

```text
http://127.0.0.1:5500/estate_Dashboard.html
```

Do not test by opening the HTML file directly, because the dashboard fetches local JSON, GeoJSON, and KMZ assets.

## Netlify

- Build command: leave blank
- Publish directory: `.`
- Root route: `_redirects` sends `/` to `estate_Dashboard.html`

## Included runtime files

- `estate_Dashboard.html`
- `estate_Dashboard.css`
- `estate_Dashboard.js`
- `_redirects`
- `mnr_Crop.PNG`
- `globev2.png`
- `data/esc_summaries.json`
- `data/esc_clipped.geojson`
- `data/road_corridor.geojson`
- `timeseries_burst_asc_path154_run1_int20_past6mo_20251223_to_20260528_lightblue20opacity_lodfixed.kmz`
- `timeseries_burst_desc_312777_run1_int20_jun2025_may2026_lodfixed_v2.kmz`

