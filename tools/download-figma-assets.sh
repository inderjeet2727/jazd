#!/usr/bin/env bash
# Downloads the 23 image/SVG assets from the JazD-01 Figma file into ../assets/
# Run from the site folder:   bash tools/download-figma-assets.sh
#
# The URLs come from the Figma MCP server and expire ~7 days after 19 Sep 2026.
# If a download fails with 403/404, ask Claude to fetch fresh URLs.
set -u
cd "$(dirname "$0")/.." || exit 1
B="https://www.figma.com/api/mcp/asset"
mkdir -p assets/img assets/svg
fail=0
dl() {  # id  ext  outfile
  if curl -fsSL -o "$3" "$B/$1.$2" && [ -s "$3" ]; then echo "ok    $3"; else echo "FAIL  $3"; rm -f "$3"; fail=1; fi
}
# --- photography (PNG) ------------------------------------------------------
dl 6c083738-858d-4561-addb-766ebe046c15 png assets/img/intro-bg.png   # 9 MB original - optimise to intro-bg.jpg (see README)
dl 81e7b191-4848-4976-ad77-6048a7ed485e jpg assets/img/dedication-bg.jpg
dl 7717eb07-b9be-4eb6-af45-f0e79ad61c15 jpg assets/img/discovery-bg.jpg
dl 2244780d-8670-4240-9215-52b4e356d21b png assets/img/socials-bg.png  # optimised to socials-bg.jpg
dl d4a63a8c-1066-4658-9651-48d3fb9c406d jpg assets/img/shop-street.jpg
# --- graphics / icons (SVG) -------------------------------------------------
dl 9371a04f-aff3-4548-9cf7-9c9000fe6db2 svg assets/svg/logo.svg
dl cf62cd1b-8361-46bb-a779-82a75a55c284 svg assets/svg/arrow.svg
dl d3829a08-aca2-4df2-bbc8-70bd02b8aa62 svg assets/svg/intro-rydim.svg
dl b4b7dcbd-b707-4d04-9b5e-19a6706df35c svg assets/svg/discovery-rydim.svg
dl 5af421e2-2553-4bf1-8804-aed9a663c85b svg assets/svg/dedication-barcode.svg
dl ca85cb8a-b3b9-450a-820b-fe9c4612f870 svg assets/svg/dedication-line.svg
dl 42400f76-29b6-41cd-af77-da12d757cb1a svg assets/svg/dedication-wave.svg
dl 5b1b28b0-29e9-4c63-8dcf-8fe111eb25f6 svg assets/svg/socials-texture.svg
dl 106cd180-7797-480d-a51d-53a088f94581 svg assets/svg/link.svg
dl 31bc5772-02f2-46da-b118-f2704763d401 svg assets/svg/studio12.svg
dl ba487991-7d5c-4f6c-b39a-fac5ee23f7be svg assets/svg/icon-x.svg
dl c583a0da-3ccb-46b3-ae9d-2c4b3fe1bbf8 svg assets/svg/icon-facebook.svg
dl 7c71c8fe-ee76-45d1-9f46-20ea2e337dbf svg assets/svg/icon-amazon.svg
dl 35b9b6ae-c4a7-4bb2-b79f-aa254a0f2657 svg assets/svg/icon-apple.svg
dl 0261fb35-1856-4a62-a4c2-1ffa9cadb5ef svg assets/svg/icon-youtube.svg
dl 417f8aa8-14bd-4023-a630-eb59b8208402 svg assets/svg/icon-tidal.svg
dl 6264bd58-a809-408c-a72d-827b5375add6 svg assets/svg/icon-soundcloud.svg
dl cd8ba336-2481-4d8e-bcf3-db1c277b2589 svg assets/svg/icon-instagram.svg
echo; [ "$fail" = 0 ] && echo "All 23 assets downloaded." || echo "Some downloads failed – see FAIL lines above."
exit $fail
