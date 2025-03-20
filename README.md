# Fresh Resume - 11ty Theme

A modern, customizable resume/CV theme for 11ty. This theme provides a clean, professional layout for showcasing your skills, experience, and qualifications. This is an empty template ready for you to customize with your own information.

## Features

- 🎨 Modern, clean design with customizable color scheme
- 📱 Fully responsive layout for all devices
- 🌓 Dark/light mode toggle
- ✨ Animated text scramble effect
- 📊 Visual skill level indicators
- 📝 Contact form with email integration via Resend
- 🧩 Modular, component-based architecture
- 📄 Easy customization through JSON data files
- 🟢 Customizable "Open to Work" status indicator
- 📎 File attachment support in contact form

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- A Cloudflare account (for deployment)
- A Resend account (for contact form email functionality)

### Installation

1. Clone this repository or use it as a template:

```bash
git clone https://github.com/yourusername/fresh-resume-theme.git my-resume
cd my-resume
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open your browser and navigate to `http://localhost:8080`

## Customization

### Site Configuration

Edit the `src/_data/site.json` file to customize your personal information, social links, and section visibility:

```json
{
  "title": "Your Name | Your Role",
  "name": "Your Name",
  "role": "Your Role",
  "bio": "A brief bio about yourself...",
  "company": {
    "name": "Your Company",
    "kvk": "Registration Number",
    "btw": "Tax ID"
  },
  "contact": {
    "email": "your.email@example.com",
    "phone": "+1 234 567 890"
  },
  "social": {
    "linkedin": "https://www.linkedin.com/in/yourusername/",
    "github": "https://github.com/yourusername",
    "certifications": "https://yourlink.com"
  },
  "colorScheme": {
    "primary": "#0078D4",
    "secondary": "#7B42BC",
    "accent": "#FF6600"
  },
  "animations": {
    "textScramble": true,
    "enabled": true
  },
  "openToWork": {
    "enabled": true,
    "status": "open",
    "text": "Open to Work",
    "colors": {
      "open": "#1DBF73",
      "busy": "#E74C3C",
      "notAvailable": "#95A5A6"
    }
  },
  "sections": {
    "header": true,
    "about": true,
    "skills": true,
    "technicalSkills": true,
    "experience": true,
    "education": true,
    "certifications": true,
    "languages": true,
    "contact": true
  }
}
```

### Open to Work Status

The theme includes a customizable "Open to Work" badge in the header section. You can configure this feature in the `site.json` file:

- `openToWork.enabled`: Set to `true` to show the badge, `false` to hide it
- `openToWork.status`: Choose from `"open"`, `"busy"`, or `"notAvailable"` to change the status indicator color
- `openToWork.text`: Customize the text shown in the badge (e.g., "Open to Work", "Currently Busy", etc.)
- `openToWork.colors`: Customize the colors for different statuses

### Content Sections

Each section of the resume has its own data file in the `src/_data` directory:

- `about.json` - About me section with tagline, summary, and principles
- `skills.json` - Skills categories and tags
- `experience.json` - Work experience timeline
- `education.json` - Education history
- `certifications.json` - Professional certifications
- `languages.json` - Language proficiency

### Profile Image

Replace the default profile image by adding your own to `src/assets/images/profile.jpg`.

### Custom CSS

You can customize the styles by editing the CSS files in the `src/assets/css` directory.

## Contact Form Email Functionality

The contact form uses [Resend](https://resend.com) to send emails through Cloudflare Functions. This allows visitors to send messages directly from your resume website.

### Setting Up Email Functionality

1. **Create a Resend Account**
   - Sign up at [resend.com](https://resend.com)
   - Verify your email address to activate your account

2. **Verify Your Domain**
   - In the Resend dashboard, navigate to "Domains" and add your domain
   - Follow Resend's instructions to add the necessary DNS records:
     - DKIM record (provided by Resend)
     - SPF record (update existing to include `include:spf.resend.com`)
     - DMARC record (if needed)

3. **Create an API Key**
   - In the Resend dashboard, go to "API Keys"
   - Create a new API key and save it securely

4. **Configure Cloudflare Pages**
   - In your Cloudflare Dashboard, go to Pages > Your site > Settings > Functions > Environment variables
   - Add a variable named `RESEND_API_KEY` with your Resend API key as the value

### Customizing Email Templates

The contact form sends emails with a modern HTML template. You can customize this template by editing the `createHtmlEmail` function in `functions/contact-form.js`.

### Troubleshooting

If you encounter issues with email delivery:

1. Check that your DNS records are properly configured in your domain provider
2. Verify your Resend API key is correctly set in Cloudflare Pages environment variables
3. Check Cloudflare Function logs for detailed error messages

## Building for Production

To build the site for production:

```bash
npm run build
```

The built site will be in the `_site` directory, ready to be deployed to your hosting provider.

## Deployment

### Cloudflare Pages

1. Push your repository to GitHub
2. In the Cloudflare dashboard, go to Pages and create a new project
3. Connect your GitHub repository
4. Configure build settings:
   - Framework preset: None
   - Build command: `npm run build`
   - Build output directory: `_site`
5. Add the environment variable `RESEND_API_KEY` with your Resend API key
6. Deploy your site

### Alternative: GitHub Pages

Note: Using GitHub Pages will not support the contact form functionality as it doesn't support serverless functions. Cloudflare Pages is the recommended deployment method for this theme.

1. Update the `pathPrefix` in `.eleventy.js` if needed:

```js
module.exports = function(eleventyConfig) {
  // ... other config
  
  return {
    pathPrefix: "/your-repo-name/",
    // ... other settings
  };
};
```

2. Add a GitHub Actions workflow file at `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install and Build
        run: |
          npm ci
          npm run build
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./_site
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [11ty](https://www.11ty.dev/) - The static site generator
- [Font Awesome](https://fontawesome.com/) - Icons
- [Google Fonts](https://fonts.google.com/) - Fonts
- [Resend](https://resend.com) - Email API service
- [Cloudflare Pages](https://pages.cloudflare.com/) - Hosting and serverless functions

---

Created by [Ridvan Ermis](https://github.com/rdmn7) 