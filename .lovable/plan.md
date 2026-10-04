# Kinetic portfolio upgrade

## Outcome
Rebuild Abel's portfolio in the selected Kinetic Dark Minimalist direction, using the locked Signal Lime palette, JetBrains Mono headings, Work Sans body text, and editorial flow. Preserve all existing sections and form fields.

## What will change
- Recompose the opening screen with a strong animated statement, availability marker, focused actions, scroll cue, and visible project preview.
- Restyle navigation and all portfolio sections into one cohesive editorial system with restrained borders, strong typography, clearer project storytelling, and consistent lime interaction states.
- Keep project details accessible on touch devices and add purposeful reveal, parallax, counter, and hover motion with reduced-motion support.
- Secure Telegram submission: remove the exposed bot token from browser code, send name, email, phone, message, and selected date through a protected function to chat `8738536556`, and keep EmailJS as a fallback.
- Remove simulated/random booking approvals; retain the current calendar and submission experience without falsely claiming a persistent global slot count.
- Correct the existing certificate type error and app metadata issues encountered during verification.

## Technical details
- Define the selected colors as semantic theme tokens rather than hardcoded page colors.
- Use existing React, Tailwind, shadcn controls, and Motion components.
- Enable Lovable Cloud for the protected Telegram request and use the existing `TELEGRAM_BOT_TOKEN` secret.
- Validate submissions in the protected function and return clear Telegram errors to the form.
- Verify desktop and mobile layouts, touch project interaction, form validation, successful compilation, and browser console state.
