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

- Keep app data access in TanStack server functions and enforce ownership with Lovable Cloud row policies, because anonymous letters and profile contact data require strict server-side boundaries.
- Use separate top-level TanStack routes for the public intro, authentication, personal desk, inbox, and anonymous composer, because each is a distinct user journey and shareable surface.
