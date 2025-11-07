// Branding Configuration Loader
// Loads branding-config.json and applies it to the site

(async function loadBranding() {
  try {
    // Fetch branding configuration
    const response = await fetch('./branding-config.json');
    const config = await response.json();

    // Store config globally for other scripts to use
    window.BRANDING_CONFIG = config;

    // Apply CSS color variables
    const root = document.documentElement;
    root.style.setProperty('--color-primary', config.colors.primary);
    root.style.setProperty('--color-primary-hover', config.colors.primaryHover);
    root.style.setProperty('--color-secondary', config.colors.secondary);
    root.style.setProperty('--color-secondary-hover', config.colors.secondaryHover);

    // Update document title
    document.title = config.site.title;

    // Update meta tags
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', config.site.description);
    }

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', config.colors.themeColor);
    }

    const metaAppleTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]');
    if (metaAppleTitle) {
      metaAppleTitle.setAttribute('content', config.event.shortName);
    }

    // Update favicon and apple touch icon
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.setAttribute('href', config.branding.favicon);
    }

    const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
    if (appleTouchIcon) {
      appleTouchIcon.setAttribute('href', config.branding.logo);
    }

    // Wait for DOM to be ready before updating content
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => applyBrandingToDOM(config));
    } else {
      applyBrandingToDOM(config);
    }

    console.log('✓ Branding configuration loaded:', config.event.name);
  } catch (error) {
    console.error('Failed to load branding configuration:', error);
  }
})();

function applyBrandingToDOM(config) {
  // Update logo
  const logo = document.querySelector('.convention-logo');
  if (logo) {
    logo.src = config.branding.logo;
    logo.alt = config.branding.logoAlt;
  }

  // Update main heading
  const heading = document.querySelector('header h1');
  if (heading) {
    heading.textContent = config.site.heading;
  }

  // Update subtitle
  const subtitle = document.querySelector('.subtitle');
  if (subtitle) {
    subtitle.textContent = config.site.subtitle;
  }

  // Update footer author link
  const authorLink = document.querySelector('.footer-author');
  if (authorLink) {
    authorLink.href = config.footer.authorLinkedIn;
    authorLink.querySelector('text, span')?.replaceWith(config.footer.authorName);
    // Update just the text node, not the icon
    const textNode = Array.from(authorLink.childNodes).find(node => node.nodeType === 3);
    if (textNode) {
      textNode.textContent = config.footer.authorName + '\n        ';
    } else {
      // If no text node, prepend the name
      authorLink.insertBefore(document.createTextNode(config.footer.authorName + '\n        '), authorLink.firstChild);
    }
  }

  // Update footer event link
  const eventLink = document.querySelector('.footer-event-link');
  if (eventLink) {
    eventLink.href = config.event.url;
    eventLink.textContent = config.event.name;
  }
}
