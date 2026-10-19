# Mesh LOD

Meshes with at least 600 indices get two clustered LODs (Rossignac vertex clustering) in `GpuSceneRenderer` . The source mesh is never rewritten.

| Distance (world/scale) | LOD |
|----------------------------|-----|
| < 40 m | original |
| 40–110 m | cell = 4.5% diagonal |
| > 110 m | cell = 12% diagonal |

The exchange uses 12% hysteresis not to oscillate at the border. Land continues in `TerrainLodSystem` . Objects near the camera, including the viewport sphere, are in the LOD 0.

Installing GPU does not yet exist: `CommandBuffer` There's only `drawIndexed` . Neither is occlusion cooking — just frustum.
