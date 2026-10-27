import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, 'src/pages');
const distDir = path.join(__dirname, 'dist');
const templatePath = path.join(distDir, 'index.html');

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));

function renderBlogBlock(block) {
  const text = escapeHtml(block.text);
  if (['h2', 'h3', 'p'].includes(block.type)) return `<${block.type}>${text}</${block.type}>`;
  if (block.type === 'warning') return `<aside><p>${text}</p></aside>`;
  if (block.type === 'link') return `<p><a href="${escapeHtml(block.href)}">${text}</a></p>`;
  if (block.type === 'list-items' || block.type === 'list-ordered') {
    const tag = block.type === 'list-items' ? 'ul' : 'ol';
    return `<${tag}>${block.items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</${tag}>`;
  }
  if (block.type === 'table') return `<table><thead><tr>${block.headers.map(header => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead><tbody>${block.rows.map(row => `<tr>${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  return '';
}

function renderStaticBlog(post) {
  return `<main class="static-blog-content"><nav><a href="/">Home</a> / <a href="/blog">Blog</a></nav><article><h1>${escapeHtml(post.title)}</h1><p>${escapeHtml(post.date)} · ${escapeHtml(post.author)}</p>${post.featuredImage ? `<img src="${escapeHtml(post.featuredImage)}" alt="${escapeHtml(post.imageAlt || post.title)}" width="1600" height="900">` : ''}${post.content.map(renderBlogBlock).join('')}</article></main>`;
}

// Helper to balance braces/brackets robustly
function extractBracket(content, startIndex, startChar, endChar) {
  let count = 0;
  let inString = null;
  let escape = false;
  
  for (let i = startIndex; i < content.length; i++) {
    const char = content[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (char === '\\') {
      escape = true;
      continue;
    }
    if (inString) {
      if (char === inString) {
        inString = null;
      }
      continue;
    }
    if (char === '"' || char === "'" || char === '`') {
      inString = char;
      continue;
    }
    if (char === startChar) {
      count++;
    } else if (char === endChar) {
      count--;
      if (count === 0) {
        return content.substring(startIndex, i + 1);
      }
    }
  }
  return null;
}

// Route mapping for standard pages
const pageRoutes = {
  'AmexPage.jsx': 'american-express',
  'AuditPage.jsx': 'audit-statement',
  'BlogIndexPage.jsx': 'blog',
  'BofAPage.jsx': 'bank-of-america',
  'CapitalOnePage.jsx': 'capital-one',
  'ChasePage.jsx': 'chase',
  'CitiPage.jsx': 'citibank',
  'CreditCardPage.jsx': 'credit-card-parser',
  'CsvToQboPage.jsx': 'csv-to-qbo-converter',
  'DecryptPage.jsx': 'unlock-pdf',
  'MergePage.jsx': 'merge',
  'OfxPage.jsx': 'ofx-converter',
  'PdfToExcelPage.jsx': 'pdf-to-excel-converter',
  'PncPage.jsx': 'pnc',
  'PrivacyPage.jsx': 'privacy',
  'ProtectPage.jsx': 'protect-pdf',
  'QboPage.jsx': 'quickbooks-qbo-converter',
  'QboToCsvPage.jsx': 'qbo-to-csv-converter',
  'QfxToCsvPage.jsx': 'qfx-to-csv-converter',
  'QifToQboPage.jsx': 'qif-to-qbo-converter',
  'ReceiptPage.jsx': 'receipt-scanner',
  'RedactPage.jsx': 'redact',
  'SplitPage.jsx': 'split',
  'TdPage.jsx': 'td-bank',
  'TermsPage.jsx': 'terms',
  'VisualizerPage.jsx': 'visualizer',
  'WellsFargoPage.jsx': 'wells-fargo',
};

const noindexRoutes = new Set();

async function run() {
  if (!fs.existsSync(templatePath)) {
    console.error('Built template dist/index.html not found! Run npm run build first.');
    process.exit(1);
  }

  const templateHtml = fs.readFileSync(templatePath, 'utf8');
  const { blogPosts } = await import('./src/data/blogPosts.js');

  // Process standard routes
  const standardPages = [];
  
  for (const [filename, route] of Object.entries(pageRoutes)) {
    const filePath = path.join(pagesDir, filename);
    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, 'utf8');

    // Extract meta strings
    const titleMatch = content.match(/title\s*=\s*["']([^"']+)["']/);
    const descMatch = content.match(/description\s*=\s*["']([^"']+)["']/);
    const canonicalMatch = content.match(/canonical\s*=\s*["']([^"']+)["']/);

    const title = titleMatch ? titleMatch[1] : '';
    const description = descMatch ? descMatch[1] : '';
    const canonical = canonicalMatch ? canonicalMatch[1] : `https://bankstatementconverttool.com/${route}`;

    // Extract schema variables
    const schemaDeclarations = {};
    const varNames = ['faqs', 'schema', 'faqSchema', 'softwareSchema', 'articleSchema'];
    
    varNames.forEach(varName => {
      const regex = new RegExp(`const\\s+${varName}\\s*=\\s*([\\[{])`);
      const match = content.match(regex);
      if (match && match.index !== undefined) {
        const braceIndex = match.index + match[0].length - 1;
        const startChar = match[1];
        const endChar = startChar === '[' ? ']' : '}';
        const declarationStr = extractBracket(content, braceIndex, startChar, endChar);
        if (declarationStr) {
          try {
            const keys = Object.keys(schemaDeclarations);
            const vals = Object.values(schemaDeclarations);
            const evalFunc = new Function(...keys, `return (${declarationStr});`);
            schemaDeclarations[varName] = evalFunc(...vals);
          } catch (e) {
            console.error(`Failed to parse ${varName} for ${filename}:`, e.message);
          }
        }
      }
    });

    // Extract jsonLd schemas list
    let jsonLd = [];
    const jsonLdMatch = content.match(/jsonLd\s*=\s*({)/);
    if (jsonLdMatch && jsonLdMatch.index !== undefined) {
      const braceIndex = jsonLdMatch.index + jsonLdMatch[0].length - 1;
      const rawExpression = extractBracket(content, braceIndex, '{', '}');
      if (rawExpression) {
        try {
          const arrayExpr = rawExpression.substring(1, rawExpression.length - 1);
          const keys = Object.keys(schemaDeclarations);
          const vals = Object.values(schemaDeclarations);
          const evalFunc = new Function(...keys, `return ${arrayExpr};`);
          jsonLd = evalFunc(...vals);
        } catch (e) {
          console.error(`Failed to parse jsonLd for ${filename}:`, e.message);
        }
      }
    }

    standardPages.push({ route, title, description, canonical, jsonLd, noindex: noindexRoutes.has(route) });
  }

  // Process Blog Posts
  const blogPostsFile = path.join(__dirname, 'src/data/blogPosts.js');
  if (fs.existsSync(blogPostsFile)) {
    try {
        blogPosts.forEach(post => {
          const route = `blog/${post.slug}`;
          const title = post.metaTitle || post.title;
          const description = post.description;
          const canonical = `https://bankstatementconverttool.com/blog/${post.slug}`;
          const jsonLd = [
            {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.description,
              "datePublished": post.publishedDate || new Date(post.date).toISOString().split('T')[0],
              "dateModified": post.publishedDate || new Date(post.date).toISOString().split('T')[0],
              ...(post.featuredImage && { "image": `https://bankstatementconverttool.com${post.featuredImage}` }),
              "author": {
                "@type": "Person",
                "name": post.author || "Mirza Arham"
              },
              "publisher": {
                "@type": "Organization",
                "name": "StatementToCSV",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://bankstatementconverttool.com/favicon-96x96.png"
                }
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": canonical
              }
            }
          ];
          standardPages.push({ route, title, description, canonical, jsonLd, post });
        });
    } catch (e) {
      console.error('Failed to import blog posts data:', e.message);
    }
  }

  // Pre-render standard pages and write to dist
  standardPages.forEach(page => {
    let html = templateHtml;

    // 1. Substitute Title
    const defaultTitle = '<title>Bank Statement to CSV Converter - Free, Private PDF Parser</title>';
    if (page.title) {
      html = html.replace(defaultTitle, `<title>${page.title}</title>`);
      html = html.replace(/<meta property="og:title" content="[^"]+" \/>/, `<meta property="og:title" content="${page.title}" />`);
    }

    // 2. Substitute Description
    if (page.description) {
      html = html.replace(
        /<meta name="description" content="[^"]+" \/>/,
        `<meta name="description" content="${page.description}" />`
      );
      html = html.replace(
        /<meta property="og:description" content="[^"]+" \/>/,
        `<meta property="og:description" content="${page.description}" />`
      );
    }

    // 3. Substitute Canonical
    if (page.canonical) {
      html = html.replace(
        /<link rel="canonical" href="[^"]+" \/>/,
        `<link rel="canonical" href="${page.canonical}" />`
      );
      html = html.replace(
        /<meta property="og:url" content="[^"]+" \/>/,
        `<meta property="og:url" content="${page.canonical}" />`
      );
    }

    if (page.post) {
      html = html.replace('<div id="root"></div>', `<div id="root">${renderStaticBlog(page.post)}</div>`);
      html = html.replace('<meta property="og:type" content="website" />', '<meta property="og:type" content="article" />');
      html = html.replace('</head>', `    <meta property="og:url" content="${escapeHtml(page.canonical)}" />\n  </head>`);
      if (page.post.featuredImage) {
        html = html.replace('</head>', `    <meta property="og:image" content="https://bankstatementconverttool.com${escapeHtml(page.post.featuredImage)}" />\n    <meta name="twitter:card" content="summary_large_image" />\n  </head>`);
      }
    } else if (page.route === 'blog') {
      html = html.replace('<div id="root"></div>', `<div id="root"><main class="static-blog-content"><h1>Bank Statement How-To Guides</h1>${blogPosts.map(post => `<article><h2><a href="/blog/${escapeHtml(post.slug)}">${escapeHtml(post.title)}</a></h2><p>${escapeHtml(post.description)}</p></article>`).join('')}</main></div>`);
    }

    if (page.noindex && !html.includes('name="robots"')) {
      html = html.replace(
        /<meta name="description" content="[^"]+" \/>/,
        (match) => `${match}\n    <meta name="robots" content="noindex,follow" />`
      );
    }

    // 4. Substitute JSON-LD
    const startMarker = '<!-- JSON-LD Structured Data: SoftwareApplication -->';
    const endMarker = '<!-- JSON-LD: HowTo (for Google HowTo rich results) -->';
    const startIndex = html.indexOf(startMarker);
    if (startIndex !== -1) {
      const endIndex = html.indexOf('</script>', html.indexOf(endMarker));
      if (endIndex !== -1) {
        const endScriptLength = '</script>'.length;
        const jsonLdBlock = html.substring(startIndex, endIndex + endScriptLength);
        
        let replacement = '';
        if (page.jsonLd && page.jsonLd.length > 0) {
          page.jsonLd.forEach(schema => {
            replacement += `\n    <script type="application/ld+json">\n    ${JSON.stringify(schema, null, 2)}\n    </script>`;
          });
        }
        html = html.replace(jsonLdBlock, replacement);
      }
    }

    // Create route directory and write index.html
    const pageRouteDir = path.join(distDir, page.route);
    fs.mkdirSync(pageRouteDir, { recursive: true });
    fs.writeFileSync(path.join(pageRouteDir, 'index.html'), html, 'utf8');
    
    console.log(`Pre-rendered: /${page.route}`);
  });

  console.log('Pre-rendering completed successfully!');
}

run();
