<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- AI image edits go through the server route src/routes/api/simulate.ts; the prompt is built server-side from material/color ids (src/lib/materials.ts) so clients cannot inject prompts.
- Product catalogue content (categories, products, specs, finishes, colours, gallery photos) lives in src/lib/catalogue.ts; pages render from it so copy changes stay in one place. src/lib/materials.ts stays dedicated to the AI simulator.
- Catalogue photos/visuals are cropped from the supplier PDF into src/assets/cat/<name>.(jpg|png).asset.json and resolved by name via img() in src/lib/catalogue.ts; product pages live at /catalogue/$produitId.
- Fence simulation: ZoneEditor fence mode builds one quad per traced ground segment; the simulator renders segments back-to-front, each pass reusing the previous result, so nearer panels occlude farther ones.
