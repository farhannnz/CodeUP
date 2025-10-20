# 📦 Install PDF Generation Packages

## Required Packages

For certificate PDF generation, you need to install these packages:

```bash
cd client
npm install html2canvas jspdf
```

## What These Do:

- **html2canvas**: Converts HTML elements to canvas/image
- **jspdf**: Generates PDF files from images

## Installation Steps:

1. Open terminal in client folder
2. Run: `npm install html2canvas jspdf`
3. Wait for installation to complete
4. Restart dev server: `npm run dev`

## Verification:

After installation, check `client/package.json` - you should see:

```json
{
  "dependencies": {
    ...
    "html2canvas": "^1.4.1",
    "jspdf": "^2.5.1",
    ...
  }
}
```

## Done!

The certificate download feature will now work! ✅
