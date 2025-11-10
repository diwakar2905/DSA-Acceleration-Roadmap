# DSA Acceleration Roadmap

A Progressive Web App (PWA) that provides a personalized, daily roadmap for learning Data Structures and Algorithms. Track your progress, take notes, and generate PDF reports of your journey.

## Features

- 📱 Progressive Web App - Install on any device
- 🔄 Syncs progress locally using browser storage
- 📊 Daily progress tracking and streak counting
- 📝 Add notes for each day's learning
- 📄 Generate detailed PDF reports
- 🌙 Dark mode support
- 💾 Works offline

## Running Locally

1. Clone the repository:
```bash
git clone https://github.com/diwakar2905/DSA-Acceleration-Roadmap.git
cd DSA-Acceleration-Roadmap
```

2. Serve using any static file server. For example, with Python:
```bash
# Python 3.x
python -m http.server 8000

# Python 2.x
python -m SimpleHTTPServer 8000
```

3. Open http://localhost:8000 in your browser

## Deployment to Vercel

1. Fork this repository

2. Import to Vercel:
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your forked repository
   - Select "Static Site" as Framework Preset
   - Deploy!

### Vercel Configuration

The project is already configured for optimal deployment on Vercel. If needed, you can create a `vercel.json`:

```json
{
  "version": 2,
  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## Project Structure

- `index.html` - Main application
- `service-worker.js` - PWA service worker for offline support
- `manifest.json` - PWA manifest
- `icons/` - PWA icons in various sizes
- `vendor/` - Local copies of dependencies
  - jsPDF
  - html2canvas
  - jsPDF-AutoTable

## Browser Support

- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- iOS Safari 13+
- Chrome for Android 80+

## Development

The app uses vanilla JavaScript and Tailwind CSS (via CDN) for simplicity. Key technologies:

- PWA for offline support
- LocalStorage for data persistence
- Service Workers for caching
- Tailwind CSS for styling
- PDF generation using jsPDF + html2canvas