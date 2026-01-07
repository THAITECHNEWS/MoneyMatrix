import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

interface ImageOptions {
  title: string;
  baseImagePath: string;
  outputPath: string;
  width?: number;
  height?: number;
}

/**
 * Generate a featured image with text overlay for an article
 */
async function generateFeaturedImage(options: ImageOptions): Promise<string> {
  const {
    title,
    baseImagePath,
    outputPath,
    width = 1200,
    height = 630
  } = options;

  // Check if base image exists
  if (!fs.existsSync(baseImagePath)) {
    throw new Error(`Base image not found: ${baseImagePath}`);
  }

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Load base image
  const baseImage = sharp(baseImagePath);

  // Get image metadata
  const metadata = await baseImage.metadata();
  const imgWidth = metadata.width || width;
  const imgHeight = metadata.height || height;

  // Resize base image to target dimensions
  const resizedImage = await baseImage
    .resize(width, height, {
      fit: 'cover',
      position: 'center'
    })
    .toBuffer();

  // Create SVG text overlay
  // Split title into multiple lines if needed (max ~40 chars per line)
  const words = title.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).length <= 40 && currentLine.length > 0) {
      currentLine += ' ' + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  // Limit to 3 lines max
  const displayLines = lines.slice(0, 3);
  if (lines.length > 3) {
    displayLines[2] = displayLines[2].substring(0, 37) + '...';
  }

  // Calculate text positioning
  const fontSize = 48;
  const lineHeight = 60;
  const textYStart = height / 2 - ((displayLines.length - 1) * lineHeight) / 2;
  const textX = width / 2;

  // Create SVG with text overlay
  const svgText = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Semi-transparent overlay for better text readability -->
      <rect x="0" y="${height * 0.3}" width="${width}" height="${height * 0.4}" fill="rgba(0,0,0,0.5)" />
      
      ${displayLines.map((line, index) => {
        const y = textYStart + (index * lineHeight);
        return `
          <text 
            x="${textX}" 
            y="${y}" 
            font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            font-size="${fontSize}"
            font-weight="700"
            fill="white"
            text-anchor="middle"
            dominant-baseline="middle"
            style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8);"
          >${escapeXml(line)}</text>
        `;
      }).join('')}
    </svg>
  `;

  // Composite the text overlay onto the image
  await sharp(resizedImage)
    .composite([
      {
        input: Buffer.from(svgText),
        top: 0,
        left: 0
      }
    ])
    .jpeg({ quality: 90 })
    .toFile(outputPath);

  return outputPath;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate featured image for an article
 */
export async function generateArticleFeaturedImage(
  articleSlug: string,
  articleTitle: string,
  baseImagePath: string = path.join(process.cwd(), 'ChatGPT Image Jan 5, 2026, 04_10_36 PM.jpg')
): Promise<string> {
  // Create output path in public/images directory
  const outputDir = path.join(process.cwd(), 'public', 'images', 'featured');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, `${articleSlug}-featured.jpg`);

  await generateFeaturedImage({
    title: articleTitle,
    baseImagePath,
    outputPath,
    width: 1200,
    height: 630 // Standard Open Graph image size
  });

  // Return relative path from public directory
  return `/images/featured/${articleSlug}-featured.jpg`;
}

// CLI usage
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('Usage: npm run generate:featured-image <article-slug> <article-title> [base-image-path]');
    console.log('\nExample:');
    console.log('  npm run generate:featured-image what-are-payday-loans "What Are Payday Loans"');
    process.exit(0);
  }

  const articleSlug = args[0];
  const articleTitle = args[1];
  const baseImagePath = args[2] || path.join(process.cwd(), 'ChatGPT Image Jan 5, 2026, 04_10_36 PM.jpg');

  try {
    console.log(`\n🎨 Generating featured image for: ${articleTitle}\n`);
    console.log(`Slug: ${articleSlug}`);
    console.log(`Base image: ${baseImagePath}\n`);

    const imagePath = await generateArticleFeaturedImage(
      articleSlug,
      articleTitle,
      baseImagePath
    );

    console.log(`✅ Featured image generated successfully!`);
    console.log(`📄 Saved to: ${imagePath}\n`);
    console.log(`Use this path in your article: ${imagePath}`);

  } catch (error: any) {
    console.error('\n❌ Error generating featured image:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}







