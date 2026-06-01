# About Page Latest Updates Journal Design

## Goal

Design the about page latest updates module as an immersive scroll journal. The module should feel like the visual climax of the page: large imagery, oversized active titles, precise progress cues, and smooth navigation between update items.

This design keeps the existing `UpdatesSection` direction and focuses on polishing structure, responsiveness, and interaction quality rather than replacing the page.

## Selected Direction

Use option A: an immersive sticky journal.

The section occupies an extended scroll area. While the user scrolls through it, a sticky viewport presents one active update at a time. The active item changes according to scroll progress, and users can also jump directly by clicking index markers or thumbnails.

## Layout

The desktop layout has three functional zones:

1. Progress navigation
   - Shows numbered update markers such as `01`, `02`, `03`.
   - Shows the active date near the marker.
   - Provides click targets to scroll to each update.
   - Uses a thin progress line to reinforce scroll position.

2. Hero journal canvas
   - Displays the active update image as the main visual.
   - Crossfades and lightly transforms images as scroll progress changes.
   - Places the active date, oversized title, and description over or near the image.
   - Keeps the title expressive, but constrains its size on smaller screens.

3. Summary rail
   - Lists all update titles with inactive items dimmed.
   - Shows image thumbnails for direct navigation.
   - Keeps the "read more" action visibly disabled until the feature is implemented.

On mobile, the section keeps the same story structure but collapses into a top heading, horizontal progress controls, the main image/title, and thumbnail controls below. The content must not overlap or overflow.

## Visual Style

The module should align with the current about page palette:

- Soft warm whites and pinks as the base.
- Mint/cyan accents for contrast.
- Dark mode equivalents using translucent dark panels and muted white text.
- Image-first composition with restrained decorative gradients.

The design should not introduce a separate visual language. It should feel connected to the hero and social sections while still giving the latest updates section its own stage-like rhythm.

## Interaction

Scroll behavior:

- The section height is derived from the number of updates, with a minimum that keeps the sticky scene meaningful.
- Scroll progress is clamped between `0` and `1`.
- The active item is calculated from progress and update count.
- Image opacity and transform are interpolated from the distance to the active progress.

Click behavior:

- Clicking an index marker or thumbnail scrolls to the matching progress position.
- If Lenis is available, use it for the scroll animation.
- If Lenis is unavailable, fall back to native smooth scrolling.

Accessibility:

- The update navigation uses a meaningful `aria-label`.
- Thumbnail buttons use the update title as their accessible label.
- Decorative images inside thumbnail buttons have empty alt text.
- The empty state remains readable and localized.

## Data

The section consumes the existing `Update[]` shape:

- `date`
- `title`
- `description`
- `image`
- `category`

No new API is required for this design. Localization continues to come from the existing about page translation data.

## Error And Edge Cases

- Empty updates: show the existing localized empty state.
- One update: keep the section stable and avoid division by zero when calculating progress.
- Long titles: constrain typography by breakpoint so text does not spill outside the viewport.
- Reduced motion: transitions should remain CSS-based and nonessential; the content must work without relying on motion.
- Sticky behavior: do not wrap this section in transform-based reveal components, because transformed ancestors can break sticky positioning.

## Testing And Verification

Verify the implementation with:

- TypeScript/build checks.
- Desktop visual check around the about page updates section.
- Mobile viewport visual check for title wrapping, image sizing, and horizontal controls.
- Manual click checks for index markers and thumbnails.
- Manual scroll checks that active item, image, title, and progress indicator remain synchronized.

## Out Of Scope

- Adding real CMS/news API integration.
- Implementing the disabled "read more" destination.
- Changing the about page hero or social sections beyond what is needed to host the updates module.
- Replacing the existing update data model.
