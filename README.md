# ArchEng Nexus

ArchEng Nexus is a prototype landing page for a next-generation architecture and engineering platform. The site showcases features like AI automation, sustainable materials, and integrated design tools.

## Running Locally

Open `index.html` directly in a browser or start a simple web server:

```bash
python3 -m http.server
```

Then visit `http://localhost:8000`.

## Updating Content

All landing page text and lists are loaded from `data/site-info.json`. The file
contains keys for the page `title`, `description`, and arrays for `features`,
`materials`, `tools`, and `solutions`. Each array item defines the text and icon
classes used by the page.

Example structure:

```json
{
  "title": "ArchEng Nexus — Next-Gen Design Platform",
  "description": "Innovative AEC platform with sustainable materials and AI automation.",
  "features": [{
    "icon": "fas fa-robot",
    "iconBg": "bg-indigo-100 dark:bg-indigo-900",
    "iconColor": "text-indigo-600 dark:text-indigo-400",
    "title": "AI Automation",
    "description": "Leverage our advanced AI to automate repetitive tasks and focus on creative design."
  }],
  "materials": [{
    "icon": "fas fa-recycle",
    "gradient": "from-green-400 to-blue-500",
    "title": "Recycled Composites",
    "description": "High-strength materials made from recycled industrial waste",
    "tag": "Sustainable",
    "tagColor": "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
  }],
  "tools": [{
    "icon": "fas fa-drafting-compass",
    "bgColor": "bg-indigo-500",
    "title": "Parametric Design",
    "description": "Create complex geometries with our intuitive parametric modeling tools."
  }],
  "solutions": [{
    "icon": "fas fa-home",
    "iconBg": "bg-indigo-100 dark:bg-indigo-900",
    "iconColor": "text-indigo-600 dark:text-indigo-400",
    "title": "Residential",
    "description": "Custom solutions for single-family homes, apartments, and residential complexes.",
    "bullets": ["Energy efficiency optimization"]
  }]
}
```

Editing this JSON file and reloading the page will update the content without
modifying the HTML.

## License

This project is released under the MIT License.
