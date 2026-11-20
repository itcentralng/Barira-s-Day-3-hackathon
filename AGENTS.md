<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Architecture

- Exhibit screens live as pathless-layout routes `src/routes/_exhibit.*.tsx`; `/` is the welcome screen outside the layout. Why: shared chrome (header, dock, idle/exit) wraps every gallery without duplicating it.
- All historical text, dates and media references come from `src/data/` (history + media); screens never hard-code institutional facts. Why: only the approved record may be shown, and one source keeps screens consistent.
- Design is a fixed 1920×1080 kiosk canvas using rem sizing and semantic tokens in `src/styles.css`; no ad hoc colour classes. Why: the exhibition runs on a landscape touch display and must keep the institutional palette.
- Animated dashed SVG strokes are revealed through a drawn mask, never by animating `pathLength` on the dashed path itself. Why: `pathLength` overrides the dash pattern and turns dotted lines solid.
- Large media (photos, film) are CDN assets referenced via `.asset.json` pointers. Why: keeps the repository light and serves media from the CDN.
