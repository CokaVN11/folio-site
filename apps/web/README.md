# Web Application

Next.js-based portfolio website with modern UI, responsive design, and contact form integration.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Validation**: Zod

## Development

```bash
# Install dependencies (from root)
pnpm install

# Start development server
pnpm --filter web dev

# Build for production
pnpm --filter web build

# Start production server
pnpm --filter web start
```

## Configuration

### Environment Variables

Create `.env.local` in the `apps/web` directory:

```bash
NEXT_PUBLIC_API_URL=https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com
```

### Customization

1. **Update Personal Information**
   - Edit `src/app/page.tsx` for home page content
   - Modify `src/app/projects/page.tsx` for project showcases
   - Update metadata in `src/app/layout.tsx`

2. **Styling**
   - Customize colors in `src/styles/globals.css`
   - Modify Tailwind configuration in `tailwind.config.js`

3. **SEO**
   - Update `public/robots.txt` with your domain
   - Update `public/sitemap.xml` with your URLs

## Structure

```
apps/web/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── layout.tsx   # Root layout
│   │   ├── page.tsx     # Home page
│   │   ├── projects/    # Projects page
│   │   └── contact/     # Contact page
│   ├── components/       # Reusable components
│   └── styles/          # Global styles
├── public/              # Static assets
│   ├── robots.txt
│   └── sitemap.xml
└── package.json
```

## Building

The build process generates static files for deployment:

```bash
pnpm --filter web build
```

Output is in `out/` directory, ready for S3 deployment.

## Deployment

Automatically deployed via GitHub Actions to S3 when changes are pushed to `main`.

Manual deployment:

```bash
# Build first
pnpm --filter web build

# Sync to S3 (bucket name from Terraform outputs)
aws s3 sync out/ s3://your-bucket-name/ --delete
```
