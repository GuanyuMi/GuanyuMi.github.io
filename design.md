# Design

## Layout Rhythm

- Use a flexible max-width container (`max-w-7xl`) centered on the page, paired with a dynamic grid layout (spanning 1 to 3 columns).
- Consistent and modern spacing based heavily on Tailwind utility scales:
  - `24px` (`p-6`) padding uniformly applying to major glass panels.
  - `24px` (`gap-6`) column gaps and section spacing.
  - Generous overall top/bottom padding (`pt-24 pb-32`) to accommodate fixed top and bottom elements.
- Incorporate fixed interactive layers: A top navigational/status bar and a bottom floating dock.
- The background utilizes fixed, large, colored blur balls (ambient glows) that adapt to the current theme.

## Composition Plan

- **Top Navigation**: A fixed menu bar displaying local time on the left, and decorative/immersion data metrics (e.g., Warp Factor, Shields) on the right.
- **Hero Section**: A bold split layout. Name, dynamic role descriptor, and brief intro text sit on the left, while a large circular portrait profile picture (framed by heavy shadows and a thick border) acts as an anchor on the right.
- **Main Grid Stack**:
  - *Row 1*: A 1/3 quick-action block (Theme toggle, GitHub, Mail) over a `Current Status` vertical list, flanking a 2/3 wide `About` glass card.
  - *Row 2*: A full-width `Skills` panel featuring an icon-rich grid of technologies.
  - *Row 3*: A 1/3 column for `Education` next to a 2/3 column for the `Experience` vertical timeline.
  - *Row 4*: A 2/3 wide `Projects` presentation alongside a 1/3 `Connect` block featuring large, highly visible call-to-action buttons.
- **Bottom Dock**: A centralized, pill-shaped floating Dock providing quick access to primary social networks.

## Style Rules

- **Vibrant Glassmorphism**: Cards employ heavy blur filters (`32px backdrop blur`) over translucent iOS-style background colors.
- **Prismatic Edge Lighting**: Major glass panels feature a complex, multi-colored pseudo-element gradient border (`linear-gradient`) applied via masking to simulate dynamic, high-fidelity light reflection.
- **Dark Mode Architecture**: Incorporate a holistic dark mode. When active, background palettes shift to deep slate (`bg-slate-950`), ambient glows shift colors, and glass elements adapt to darker overlays (`glass-dark`).
- **Premium Radii**: Corner rounding must feel natural and generous following Apple's aesthetics (`--radius-ios` at `24px` for main cards, and `12px` for nested items).
- **Color Identity**: Lean into electric, vivid accent colors instead of flat standard colors (e.g., Electric Violet, Vibrant Rose, Vivid Cyan).

## Content Rules

- Visual imagery (Lucide icons) actively drives the content hierarchy. They are mandatory for rendering the Status widget, Skills grid, and Contact sections.
- `Experience` displays as a vertical timeline using nested colored markers to delineate between different scopes of work (e.g., research vs. internal).
- `Projects` display as nested cards featuring dedicated icon markers, brief tag lists, and hover-triggered external link indications.

## Motion Thesis

- **Orchestrated Entrances**: Use Framer Motion (`motion/react`) for staggered, upward-fading entrance animations across all major layouts upon page load (`duration: 0.6` with staggered delays).
- **Tactile Micro-interactions**: Interactive components like project cards or theme toggles should physically react to pointers (`scale: 1.01` or `scale: 0.95` on tap).
- **Cinemic Transitions**: Dark mode toggle color shifts and background glow re-colorings must animate slowly (`duration-700` or `1000ms`) giving a fluid, cinematic ambiance rather than an abrupt theme swap.
- **Dock Bounciness**: Bottom dock elements must jump playfully up and scale (`y: -8, scale: 1.1`) smoothly when hovered.
