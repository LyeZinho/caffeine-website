# MESH & PREFAB ASSET PIPELINE - COMPLETE ANALYSIS & WIRING PLAN

## 📊 STATUS TODAY

### ✅ Implemented (Base Foundation)
1. **MeshLoader::parseGLTF()** - Interpreta .glb/.gltf via tinygltf
2. **MeshEncoder** - Serializa Mesh → .caf binary
3. **AssetManager::resolveMesh()** - Zero-copy mesh loading
4. **PrefabSerializer** - Save/load entities em CAF format
5. **AssetManager::resolvePrefab()** - Prefab resolution
6. **Mesh drag-drop** - SceneViewport auto-cria MeshFilterComponent + MeshRendererComponent
7. **Save as Prefab button** - InspectorPanel com FilePicker

### ❌ Missing Complete Integration (Wiring)

## 🔴 CRITICAL GAPS

### Gap 1: Scene Serialization Incompleta
**Problema**: SceneSerializer doesn't know MeshFilterComponent/MeshRendererComponent
**Consequência**: Scenes with meshes do not save/load
**Solução**: Extend SceneSerializer com type IDs 18-19

### Gap 2: Prefab Untraced Instances
**Problema**: Without PrefabInstance component, there is no way to know if entity came from prefab
**Consequência**: Sem suporte a prefab linking/updates
**Solução**: Criar PrefabComponents.hpp com PrefabInstance struct

### Gap 3: Asset Cooking Incompleto
**Problema**: AssetCooker has no CookMeshes()
**Consequência**: Build does not convert .obj/.gltf/.glb → .caf automatically
**Solução**: Add AssetCooker::CookMeshes() com MeshLoader + MeshEncoder

### Gap 4: Sem UI para Instanciar Prefabs
**Problema**: Sem menu "Place Prefab..." no editor
**Consequência**: Users cannot place prefabs after saving
**Solução**: Add menu item em HierarchyPanel + FilePicker

### Gap 5: Prefab Instances Do Not Persist
**Problema**: Scenes do not save/load PrefabInstance date
**Consequência**: Prefab instances perdidas ao fechar/reabrir
**Solução**: Extend SceneSerializer com type ID 20 para PrefabInstance

### Gap 6: UX Fraca na Save Prefab
**Problema**: No validation/feedback when saving prefab
**Consequência**: Users do not know if it worked
**Solução**: Add notifications + error handling

## 📋 PLANO DE WIRING (6 FASES SEQUENCIAIS)

### Phase 1: SceneSerializer - Mesh Support
- [ ] Add type IDs: kTypeMeshFilter=18, kTypeMeshRenderer=19
- [ ] collectMeshFilterComponents()
- [ ] collectMeshRendererComponents()
- [ ] applyMeshFilterComponent()
- [ ] applyMeshRendererComponent()
- **Files**: src/editor/SceneSerializer.hpp/cpp
- **Est. Tempo**: 30 min
- **Criteria**: Scene save/load round-trip preserves mesh paths

### PHASE 2: PrefabInstance Component
- [ ] Create src/ecs/PrefabComponents.hpp
- [ ] struct PrefabInstance { prefabPath, rootEntityId }
- [ ] Register no ComponentRegistry
- **Files**: src/ecs/PrefabComponents.hpp
- **Est. Tempo**: 15 min
- **Criteria**: Component appearances in registry, no compile errors

### PHASE 3: AssetCooker - Mesh Cooking
- [ ] Add AssetCooker::CookMeshes()
- [ ] Integrate MeshLoader + MeshEncoder
- [ ] Hook na build system
- [ ] Create output .caf files
- **Files**: src/editor/AssetCooker.hpp/cpp
- **Est. Tempo**: 45 min
- **Criteria**: Build genera .caf from source meshes

### PHASE 4: HierarchyPanel - Place Prefab Menu
- [ ] Add "Place Prefab..." menu item
- [ ] FilePicker → select .caf prefab
- [ ] PrefabSerializer::load()
- [ ] Create PrefabInstance wrapper
- [ ] Entity appears in viewport
- **Files**: src/editor/HierarchyPanel.cpp
- **Est. Tempo**: 40 min
- **Criteria**: Can place prefab via menu, entity visible

### Phase 5: SceneSerializer - Prefab Instance Support
- [ ] Add type ID: kTypePrefabInstance=20
- [ ] collectPrefabInstanceComponents()
- [ ] applyPrefabInstanceComponent()
- [ ] Serialize prefabPath
- **Files**: src/editor/SceneSerializer.hpp/cpp
- **Est. Tempo**: 30 min
- **Criteria**: Scene with prefab instances save/load correctly

### Phase 6: UX Polish - Notifications & Validation
- [ ] Validate entity in savePrefab()
- [ ] Add error notifications
- [ ] Add success notifications with file path
- [ ] Ask for destination directory
- [ ] Handle edge cases
- **Files**: src/editor/InspectorPanel.cpp
- **Est. Tempo**: 25 min
- **Criteria**: UX feedback working, error fetch

## 🎯 TOTAL EFFORT
**Estimated**: 3-4 hours of implementation
**Complexity**: Average (integration, not new algorithm)
**Risk**: Low (localised changes)

## 📐 DEPENDENCIES

```
Fase 1 ← Fase 2 ← Fase 3 (independent)
                ↓
        Fase 4 ← Fase 5 ← Fase 6 (independent)
```

**Path crítico**: 1 → 2 → 4 → 5
**Path paralelo**: 3 pode ser feito em paralelo com 1-2

## ✅ ACCEPTANCE CRITERIA (POR PHASE)

### Phase 1
- Mesh scene save/load preserves MeshFilterComponent.customMeshPath
- Mesh scene save/load preserves MeshRendererComponent.meshPath

### Phase 2
- PrefabInstance component compiles
- Appears in Component Add menu

### Phase 3
- CookMeshes() callable from AssetCooker
- Generates .caf files from .obj/.gltf/.glb
- Files in correct output directory

### Phase 4
- "Place Prefab..." menu exists
- FilePicker works
- Entity instantiates from prefab

### Phase 5
- PrefabInstance data serializes
- Scene save includes prefab path
- Scene load recreates instance

### Phase 6
- Notifications appear on save
- Errors caught and displayed
- User can select directory

## 🚀 NEXT STEPS

1. User approval deste plano
2. Start Phase 1: SceneSerializer mesh support
3. Sequential implementation das 6 fases
4. Testing after each phase
5. Final integration test: full workflow

