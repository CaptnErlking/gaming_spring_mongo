# Design Tokens - Gaming Club Frontend

This document outlines the design system and tokens used in the Gaming Club frontend application.

## 🎨 Color Palette

### Primary Colors
- **Gaming Dark**: Deep charcoal backgrounds for dark theme
  - `gaming-dark-50`: #f8fafc (lightest)
  - `gaming-dark-100`: #f1f5f9
  - `gaming-dark-200`: #e2e8f0
  - `gaming-dark-300`: #cbd5e1
  - `gaming-dark-400`: #94a3b8
  - `gaming-dark-500`: #64748b
  - `gaming-dark-600`: #475569
  - `gaming-dark-700`: #334155
  - `gaming-dark-800`: #1e293b
  - `gaming-dark-900`: #0f172a
  - `gaming-dark-950`: #0b0f14 (darkest)

### Neon Accent Colors
- **Cyan**: `#00ffd1` - Primary accent, CTAs, highlights
- **Magenta**: `#ff00ff` - Secondary accent, special elements
- **Purple**: `#8a2be2` - Tertiary accent, admin elements
- **Blue**: `#00bfff` - Information, links
- **Green**: `#00ff00` - Success states, positive values

### Theme Variables
```css
/* Light Theme */
--bg-primary: #ffffff
--bg-secondary: #f8fafc
--bg-tertiary: #f1f5f9
--text-primary: #0f172a
--text-secondary: #475569
--text-muted: #94a3b8
--border-primary: #e2e8f0
--border-secondary: #cbd5e1

/* Dark Theme */
--bg-primary: #0b0f14
--bg-secondary: #0f1720
--bg-tertiary: #1e293b
--text-primary: #f8fafc
--text-secondary: #cbd5e1
--text-muted: #94a3b8
--border-primary: #334155
--border-secondary: #475569
```

## 🔤 Typography

### Font Families
- **Primary**: `Inter` - Clean, modern sans-serif for body text
- **Display**: `Orbitron` - Futuristic monospace for headings and special elements

### Font Weights
- `300` - Light
- `400` - Regular
- `500` - Medium
- `600` - Semi-bold
- `700` - Bold
- `900` - Black

### Font Sizes
- `text-xs`: 12px
- `text-sm`: 14px
- `text-base`: 16px
- `text-lg`: 18px
- `text-xl`: 20px
- `text-2xl`: 24px
- `text-3xl`: 30px
- `text-4xl`: 36px

## 📏 Spacing Scale

### Padding & Margins
- `p-1`: 4px
- `p-2`: 8px
- `p-3`: 12px
- `p-4`: 16px
- `p-6`: 24px
- `p-8`: 32px
- `p-12`: 48px

### Gaps
- `gap-1`: 4px
- `gap-2`: 8px
- `gap-3`: 12px
- `gap-4`: 16px
- `gap-6`: 24px
- `gap-8`: 32px

## 🎭 Component Styles

### Buttons
```css
.btn-primary {
  background: var(--accent-primary);
  color: var(--gaming-dark-950);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}
```

### Cards
```css
.card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.card-glow {
  box-shadow: 0 0 20px rgba(0, 255, 209, 0.1);
}
```

### Input Fields
```css
.input-field {
  width: 100%;
  padding: 12px 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(0, 255, 209, 0.1);
}
```

## ✨ Animations

### Keyframes
```css
@keyframes glow {
  0% { box-shadow: 0 0 5px #00ffd1, 0 0 10px #00ffd1, 0 0 15px #00ffd1; }
  100% { box-shadow: 0 0 10px #00ffd1, 0 0 20px #00ffd1, 0 0 30px #00ffd1; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}
```

### Animation Classes
- `animate-glow`: Pulsing glow effect
- `animate-float`: Gentle floating motion
- `animate-pulse-slow`: Slow pulsing animation
- `animate-spin`: Standard rotation

## 🎯 Effects

### Gradients
```css
.gaming-gradient {
  background: linear-gradient(135deg, #00ffd1 0%, #8a2be2 50%, #ff00ff 100%);
}

.gaming-text-gradient {
  background: linear-gradient(to right, #00ffd1, #8a2be2, #ff00ff);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}
```

### Glass Effects
```css
.glass-effect {
  backdrop-filter: blur(16px);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dark .glass-effect {
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Neon Glow
```css
.neon-glow {
  box-shadow: 0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor;
}
```

## 📱 Responsive Breakpoints

- **sm**: 640px - Small devices (phones)
- **md**: 768px - Medium devices (tablets)
- **lg**: 1024px - Large devices (laptops)
- **xl**: 1280px - Extra large devices (desktops)
- **2xl**: 1536px - 2X large devices (large desktops)

## 🎨 Design Principles

### 1. Gaming Aesthetic
- Dark-first design with neon accents
- Futuristic typography and effects
- Glowing elements and subtle animations
- High contrast for readability

### 2. Accessibility
- WCAG AA compliant color contrast
- Keyboard navigation support
- Screen reader friendly
- Focus indicators

### 3. Consistency
- Unified spacing scale
- Consistent component styling
- Predictable interaction patterns
- Standardized color usage

### 4. Performance
- Optimized animations (60fps)
- Efficient CSS with Tailwind
- Minimal bundle size
- Fast loading times

## 🔧 Customization

### Adding New Colors
1. Add color to `tailwind.config.js`
2. Update CSS variables in `index.css`
3. Create utility classes if needed

### Modifying Components
1. Update component styles in `index.css`
2. Maintain consistency with design tokens
3. Test across themes and breakpoints

### Creating New Animations
1. Define keyframes in `index.css`
2. Add animation classes to Tailwind config
3. Use sparingly for performance

## 📊 Usage Guidelines

### Color Usage
- **Primary Accent**: Use for CTAs, active states, highlights
- **Secondary Accent**: Use for admin elements, special features
- **Tertiary Accent**: Use for decorative elements, gradients
- **Neutral Colors**: Use for text, backgrounds, borders

### Typography
- **Inter**: Use for body text, labels, descriptions
- **Orbitron**: Use for headings, logos, special text
- **Font Weights**: Use 400-500 for body, 600-700 for headings

### Spacing
- **Consistent Scale**: Always use the defined spacing scale
- **Visual Hierarchy**: Use larger spacing for important elements
- **Responsive**: Adjust spacing for different screen sizes

This design system ensures consistency, accessibility, and a cohesive gaming experience across the entire application.
