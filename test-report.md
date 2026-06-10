# Test Report — Birthday Invitation Website

**Stack:** React + Vite · **Build:** `npm run build` ✓ · **Lint:** `npm run lint` ✓
**Tested via:** Vite production preview (`npm run preview`) in Chrome

## Summary
All core flows pass. The invitation renders correctly, the countdown is live, and the RSVP form validates input and confirms submissions.

| Test | Result |
| --- | --- |
| Hero renders with live countdown + event detail cards | PASS |
| RSVP form shows validation errors on empty submit | PASS |
| Valid RSVP shows personalized confirmation | PASS |

## Evidence

### 1. Hero + live countdown + event details
![Hero and countdown](https://app.devin.ai/attachments/e46e5c62-34e1-4768-9d42-50671dcf5803/screenshot_c88c3db941c04de28fb62926e429d652.png)

### 2. RSVP validation on empty submit
"Please enter your name." / "Please enter your email." errors render inline.
![Validation errors](https://app.devin.ai/attachments/c1f4ab14-1d7f-4197-9fab-4b4b89091ccb/screenshot_9c5d501b7c8b4a559792842dcfc29ee9.png)

### 3. Successful RSVP confirmation
![Success confirmation](https://app.devin.ai/attachments/a1d63d3a-7746-43b4-a43e-fd76da950fa3/screenshot_1bc2821d57d74fe6a6b0582743f05c09.png)

## Notes
- Event details are configurable in `src/eventConfig.js`.
- The RSVP form is client-side only (no backend); submissions are not persisted. A backend or form service (e.g. Formspree) can be wired in if needed.
