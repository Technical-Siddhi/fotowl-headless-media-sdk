# Installation

## Workspace Package Setup

Within a pnpm workspace monorepo, add the dependencies to your application's `package.json`:

```json
{
  "dependencies": {
    "@fotowl/media-core": "workspace:*",
    "@fotowl/media-react": "workspace:*",
    "@fotowl/media-ui-react": "workspace:*"
  }
}
```

Run pnpm install from the root:

```bash
pnpm install
```

## Environment Variables

For web applications using Vite, configure your API key in `.env`:

```env
VITE_PEXELS_API_KEY=your_pexels_api_key_here
```
