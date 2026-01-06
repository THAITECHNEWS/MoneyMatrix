# MoneyMatrix.me - Automated Financial Content Platform

A fully automated content generation and publishing system for financial comparison website MoneyMatrix.me. This system uses AI to generate high-quality, SEO-optimized financial content, processes images, builds static sites, creates backlinks, and deploys to Cloudflare Workers.

## 🚀 Features

### Content Generation
- **AI-Powered Writing**: Uses DeepSeek API to generate 1000+ word financial articles
- **SEO Optimization**: Automatic meta descriptions, structured data, and keyword optimization
- **Multiple Content Formats**: 3 different prompt templates (A, B, C) for content variety
- **Smart Topic Management**: Tracks published articles and generates topic variations

### Image Processing
- **Automatic Image Selection**: Integrates with Unsplash and Pixabay APIs
- **SEO-Friendly Alt Text**: Generates contextual alt text for accessibility
- **Responsive Images**: Optimized for various screen sizes
- **Fallback Placeholders**: Creates branded placeholders when external images unavailable

### Site Generation
- **Static Site Generator**: Fast, SEO-friendly HTML generation
- **Mobile-Responsive Design**: Professional design inspired by NerdWallet
- **Semantic HTML**: Proper use of article, section, header tags for SEO
- **Fast Loading**: Optimized CSS and JavaScript

### Automation Features
- **Scheduled Publishing**: Publish articles every 2 hours automatically
- **Internal Linking**: Smart cross-linking between related articles
- **Backlink Creation**: Automatically posts shorter versions to Medium, Dev.to, Blogger
- **Cloudflare Deployment**: One-click deployment to Cloudflare Workers

## 📁 Project Structure

```
MoneyMatrix/
├── data/                          # JSON data files
│   ├── topics.json               # Article topics by category
│   ├── categories.json           # Financial categories and URLs
│   ├── published_articles.json   # Tracking published content
│   ├── api_credentials.json      # API keys and credentials
│   └── external_blogs.json      # External blogging platforms
├── advanced_prompts/             # AI prompt templates
│   ├── prompt_A.md              # Comprehensive guide format
│   ├── prompt_B.md              # Problem-solution format
│   └── prompt_C.md              # Listicle comparison format
├── scripts/                      # Python automation scripts
│   ├── auto_post.py             # Main orchestration script
│   ├── content_generator.py     # AI content generation
│   ├── html_generation.py       # Static site generator
│   ├── image_handler.py         # Image processing and optimization
│   ├── backlink_poster.py       # External platform posting
│   ├── cloudflare_deploy.py     # Cloudflare deployment
│   └── utils.py                 # Shared utilities and managers
├── templates/                    # Jinja2 HTML templates
│   ├── base.html               # Base template with navigation
│   ├── article.html            # Individual article pages
│   ├── homepage.html           # Homepage template
│   └── category.html           # Category listing pages
├── static/                       # Static assets
│   ├── css/main.css            # Modern, responsive CSS
│   ├── js/main.js              # Interactive JavaScript
│   └── images/                 # Generated and processed images
├── dist/                         # Generated static site
├── deploy/                       # Cloudflare deployment files
├── config.json                   # System configuration
├── requirements.txt              # Python dependencies
└── README.md                     # This file
```

## 🛠️ Setup Instructions

### 1. Environment Setup

```bash
# Clone or create the project directory
git clone <your-repo> MoneyMatrix
cd MoneyMatrix

# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies for deployment (optional)
cd deploy
npm install
cd ..
```

### 2. Configuration

#### API Credentials
Edit `data/api_credentials.json`:

```json
{
  "deepseek": {
    "api_key": "YOUR_DEEPSEEK_API_KEY",
    "base_url": "https://api.deepseek.com/v1",
    "model": "deepseek-chat"
  },
  "cloudflare": {
    "account_id": "YOUR_CLOUDFLARE_ACCOUNT_ID",
    "api_token": "YOUR_CLOUDFLARE_API_TOKEN",
    "zone_id": "YOUR_ZONE_ID"
  },
  "image_services": {
    "unsplash": {
      "access_key": "YOUR_UNSPLASH_ACCESS_KEY"
    },
    "pixabay": {
      "api_key": "YOUR_PIXABAY_API_KEY"
    }
  }
}
```

#### System Configuration
Modify `config.json` to adjust:
- Publishing intervals
- Content generation settings
- Feature toggles
- SEO parameters

### 3. Quick Start

#### Generate Your First Article
```bash
python scripts/auto_post.py --generate-only
```

#### Build the Complete Site
```bash
python scripts/auto_post.py --build-only
```

#### Run Full Automation Cycle
```bash
python scripts/auto_post.py
```

#### Setup Scheduled Automation
```bash
python scripts/auto_post.py --schedule
```

## 📊 Content Categories

The system generates content for these financial categories:

1. **Auto Loans** - Car financing and refinancing
2. **Credit Score** - Credit monitoring and improvement
3. **Personal Loans** - Debt consolidation and personal financing
4. **Mortgages** - Home loans and refinancing
5. **Business Loans** - Business financing options
6. **Regional Loans** - Location-specific lending
7. **Credit Cards** - Credit card comparisons
8. **Student Loans** - Education financing
9. **Rewards & Cashback** - Credit card rewards optimization
10. **Balance Transfers & Debt Management** - Debt management strategies
11. **Building & Rebuilding Credit** - Credit improvement
12. **Travel & Premium Cards** - Premium credit cards
13. **Business Credit Cards** - Business credit solutions
14. **Credit Card Security** - Payment security
15. **Advanced Tips & Optimization** - Advanced financial strategies

## 🤖 Automation Commands

### Content Generation
```bash
# Generate single article
python scripts/auto_post.py --generate-only

# Generate multiple articles
python scripts/auto_post.py --generate-only --generate-count 5

# Generate content only (no site build)
python scripts/auto_post.py --generate-only
```

### Site Management
```bash
# Build static site
python scripts/auto_post.py --build-only

# Create backlinks
python scripts/auto_post.py --backlinks

# Deploy to Cloudflare
python scripts/auto_post.py --deploy

# Check system status
python scripts/auto_post.py --status
```

### Scheduled Operations
```bash
# Run continuous automation (publishes every 2 hours)
python scripts/auto_post.py --schedule

# Run single automation cycle
python scripts/auto_post.py
```

## 🚀 Deployment Options

### Cloudflare Workers (Recommended)
```bash
# Setup deployment files
python scripts/auto_post.py --setup

# Configure Cloudflare credentials
# Edit data/api_credentials.json

# Deploy
cd deploy
wrangler login
wrangler publish
```

### GitHub Actions (Automatic)
The system includes GitHub Actions for automatic deployment:

1. Push code to GitHub repository
2. Configure repository secrets:
   - `DEEPSEEK_API_KEY`
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
   - `UNSPLASH_ACCESS_KEY`
   - `PIXABAY_API_KEY`
3. Every push to main branch triggers automatic content generation and deployment

### Manual Static Hosting
```bash
# Build the site
python scripts/auto_post.py --build-only

# Upload dist/ directory to any static hosting provider
# (Netlify, Vercel, GitHub Pages, etc.)
```

## 🔧 Advanced Configuration

### AI Content Generation
- **Models**: Primary (DeepSeek) with fallback options
- **Prompts**: Three different formats for content variety
- **Topics**: Expandable topic database with automatic variations
- **Quality**: 800-1500 word articles with proper structure

### SEO Optimization
- **Structured Data**: JSON-LD schema markup
- **Meta Tags**: Optimized titles and descriptions
- **Internal Linking**: Smart cross-linking system
- **Sitemap**: Automatic XML sitemap generation
- **Semantic HTML**: Proper heading hierarchy and tags

### Image Processing
- **Sources**: Unsplash (primary), Pixabay (fallback)
- **Optimization**: Automatic resizing and compression
- **Alt Text**: AI-generated contextual descriptions
- **Fallbacks**: Branded placeholder generation

### Backlink Strategy
- **Platforms**: Medium, Dev.to, Blogger support
- **Content**: 300-word summary articles with links back
- **Scheduling**: Automated posting with rate limiting
- **Tracking**: Complete backlink analytics

## 📈 Monitoring and Analytics

### System Status
```bash
python scripts/auto_post.py --status
```

Shows:
- Total articles published
- Articles published today
- Backlink statistics
- Next scheduled publish time
- Feature status

### Logs
- **File**: `moneymatrix.log`
- **Level**: Configurable (DEBUG, INFO, WARNING, ERROR)
- **Rotation**: Automatic log rotation and cleanup

### Performance Metrics
- Content generation speed
- Image processing time
- Site build duration
- Deployment success rate

## 🔒 Security Features

- **API Key Management**: Secure credential storage
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Sanitizes all user inputs
- **CORS Protection**: Configurable cross-origin policies
- **Security Headers**: Implements security best practices

## 🛡️ Error Handling

- **Graceful Degradation**: System continues if non-critical components fail
- **Retry Logic**: Automatic retries for API failures
- **Fallback Systems**: Backup options for all external services
- **Comprehensive Logging**: Detailed error tracking and debugging

## 📝 Content Quality

### AI-Generated Content Features
- **Human-like Writing**: Natural, engaging tone
- **Financial Expertise**: Industry-specific knowledge
- **SEO Optimization**: Keyword integration and structure
- **Factual Accuracy**: Current 2025 financial information
- **Comprehensive Coverage**: Detailed guides with actionable advice

### Content Validation
- **Word Count**: Ensures articles meet minimum length requirements
- **Structure Validation**: Proper HTML formatting and hierarchy
- **Link Verification**: Validates internal and external links
- **Image Integration**: Ensures all images have proper alt text

## 🤝 Contributing

To extend the system:

1. **Add New Categories**: Update `data/categories.json` and `data/topics.json`
2. **Custom Prompts**: Create new prompt templates in `advanced_prompts/`
3. **New Integrations**: Add API clients in respective scripts
4. **UI Improvements**: Modify templates and CSS in `templates/` and `static/`

## 📄 License

This project is proprietary software for MoneyMatrix.me. All rights reserved.

## 🆘 Support

For technical issues:
1. Check the logs in `moneymatrix.log`
2. Verify API credentials and rate limits
3. Ensure all dependencies are installed
4. Review configuration in `config.json`

---

**MoneyMatrix.me** - Automating financial content creation with AI-powered precision.