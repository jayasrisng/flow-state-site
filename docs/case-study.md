# Flow State Web Demo Case Study

## Summary

Flow State Web Demo is the product/onboarding companion for the Flow State Unity XR prototype. It presents the immersive music concept through a web flow: landing page, connection journey, headset launch, dashboard, playlists, session state, and concert-mode visualization.

The repository complements the Unity runtime by explaining the product experience in a browser-friendly format.

## Problem

XR prototypes are often hard to understand without a headset. A web companion can make the idea legible before someone enters the immersive runtime.

The project asks:

> How can a web demo explain an immersive music experience without pretending to replace the actual XR interaction?

## Approach

The site separates product framing from Unity runtime work:

- `flow-state` contains the Unity XR prototype.
- `flow-state-site` contains the web story, onboarding journey, and concept visualization.

This lets the concept be understood in two layers: a fast web walkthrough and a deeper immersive runtime.

## Tech stack

- React 19
- TypeScript
- Vite 8
- React Router
- Tailwind CSS 4
- GitHub Pages deployment through GitHub Actions

## Design decisions

### Explain before launching

The site creates context before the user reaches the XR build. This is useful for concepts that require hardware or device setup.

### Keep the web demo honest

The web experience is a companion and product demo, not the full VR runtime.

### Use web UI for onboarding

Connection, setup, playlist browsing, and launch flows are easier to communicate through conventional UI before moving into XR.

## Challenges

### Avoiding duplication

The web repo and Unity repo need clearly separated responsibilities so they do not look like two incomplete versions of the same project.

### Deployment polish

GitHub Pages deployments can serve stale content; the README documents the deployment path and refresh behavior.

## What this demonstrates

- Product explanation for an immersive concept.
- React/Vite frontend implementation.
- Companion-site architecture for a Unity/XR prototype.
- Clear separation between web demo and runtime experience.

## Future work

- Add screenshots/GIFs of the onboarding and concert-mode flow.
- Add links back to the Unity repo in the UI.
- Add metadata for share previews.
- Document deployment URL and GitHub Actions workflow behavior.
