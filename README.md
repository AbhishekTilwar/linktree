# Links

A modern Linktree-style page with a password-protected link manager.

## Colour palette

| Token       | Hex     |
| ----------- | ------- |
| Ivory       | `#F8F3EB` |
| Peach       | `#E88B68` |
| Terracotta  | `#C87555` |
| Sand        | `#B9A18B` |
| Espresso    | `#2C211C` |

## Local development

```bash
npm install
npm run dev
```

## Manage links

1. Open the page
2. Tap the **logo** or **name**
3. Enter password: `Add@123`
4. Add, edit, reorder, or delete links

Changes are saved in the browser (`localStorage`) right away.

To publish updates for every visitor:

1. In the admin panel, click **Export links.json**
2. Replace `public/links.json` with the downloaded file
3. Redeploy

## Deploy to Vercel

```bash
npx vercel
```

Or push this repo to GitHub and import it in the [Vercel dashboard](https://vercel.com/new).

Build command: `npm run build`  
Output directory: `dist`
