# Volumetric light

Active in **Forward Render Features → Volumetrics** (or Moon `setVolumetrics` ). By default it is ** Off**.

There's not a second geometry draw. The fog march from the chamber to the surface in the already running shader:

- **Low** — 6 steps
- ** Medium** — 12 steps
- **Density** e **Height** controlam a densidade e a queda com a altitude
- **Anisotropy**turns the fog towards the sun
- **Sample shadows ** Reads shadow map at each step (more expensive; leaves off if frame goes 16 ms)

A 3D froxel doesn't exist yet. See [`forward-render-features.md`](forward-render-features.md).
