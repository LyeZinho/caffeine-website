# Editor Test Automation - Setup & Usage Guide

## Overview

This document describes how to use the **autonomous test automation framework** for validating Caffeine Doppio editor features without manual UI testing.

**Problem Solved:**
You can now implement ANY editor feature, create an automated test, and validate it 100% programmatically. No more sending screenshots back-and-forth.

---

## Architecture

> ┐
> │ editor_test_automation.py │
> - DoppioTestHarness (process control)
> │ - EditorTestSuite (test cases) │
> │ - JSON protocol (communication) │
> └
> │
> ┐
> │ │ │
> ↓ ↓ ↓
> [stdin/stdout] [env vars] [working dir]
> │ │ │
> ↓ ↓ ↓
> ┐
> Doppio (./build/doppio)
> │ │
> DOPPIO TEST MODE=1 activates:
> │ - TestInstrumentation callbacks │
> │ - JSON output on TEST_RESULT: │
> │ - stdin command parsing │
> └


---

## Step 1: Enable Test Instrumentation in Doppio

Add to `src/editor/SceneViewport.cpp` after selection changes:

```cpp
#include "editor/TestInstrumentation.hpp"

// In click selection handler:
if (selectedEntity.isValid()) {
    if (shiftPressed) {
        ctx.toggleSelection(selectedEntity);
    } else {
        ctx.selectEntity(selectedEntity);
    }
    
    // INSTRUMENTATION:
    TestInstrumentation::onEntitiesSelected(ctx.selectedEntities);
}
```

Add after delete key handler:

```cpp
if (ImGui::IsKeyPressed(ImGuiKey_Delete) && ctx.selectedEntity.isValid()) {
    ctx.beginUndo(EditorCommand::RemoveEntity, ctx.selectedEntity.id(), world);
    world.destroy(ctx.selectedEntity);
    ctx.selectedEntity = ECS::Entity::INVALID;
    
    // INSTRUMENTATION:
    TestInstrumentation::onSceneEntities(/* list of scene entities */);
    
    ctx.endUndo(world);
}
```

Add after scene load:

```cpp
// In scene loading code:
TestInstrumentation::onSceneLoaded(scenePath);
```

---

## Step 2: Implement stdin Command Parsing

In `src/editor/SceneViewport.cpp` in the `render()` method, add a test command processor:

```cpp
void processTestCommand(const std::string& cmd, ECS::World& world, EditorContext& ctx) {
    if (cmd.find("select_entity") == 0) {
        int id = std::stoi(cmd.substr(14));
        ECS::Entity entity(id);
        if (world.get<ECS::Transform>(entity) || world.get<ECS::Position3D>(entity)) {
            ctx.selectEntity(entity);
            TestInstrumentation::onEntitySelected(entity);
        }
    } 
    else if (cmd.find("multi_select") == 0) {
        int id = std::stoi(cmd.substr(13));
        ECS::Entity entity(id);
        ctx.toggleSelection(entity);
        TestInstrumentation::onEntitiesSelected(ctx.selectedEntities);
    }
    else if (cmd == "delete_selected") {
        if (ctx.selectedEntity.isValid()) {
            world.destroy(ctx.selectedEntity);
            ctx.selectedEntity = ECS::Entity::INVALID;
            // Collect remaining entities
            std::vector<ECS::Entity> remaining;
            // ... iterate world entities ...
            TestInstrumentation::onSceneEntities(remaining);
        }
    }
    else if (cmd == "focus_selected") {
        if (ctx.selectedEntity.isValid()) {
            Vec3 pos;
            if (tryGetEntityPosition(world, ctx.selectedEntity, pos)) {
                ctx.camFocus = pos;
                ctx.camDistance = 5.0f;
                TestInstrumentation::onCameraFocused(pos, 5.0f);
            }
        }
    }
    else if (cmd == "get_scene") {
        std::vector<ECS::Entity> entities;
        // ... iterate world and collect ...
        TestInstrumentation::onSceneEntities(entities);
    }
}

// In render loop (if test mode):
if (TestInstrumentation::isTestMode()) {
    std::string cmd;
    if (std::getline(std::cin, cmd)) {
        processTestCommand(cmd, world, ctx);
    }
}
```

---

## Step 3: Compile with Test Support

Doppio already compiles. Just ensure `TestInstrumentation.hpp` is in the include path.

```bash
cd /home/pedro/repo/caffeine/build
make doppio -j8
```

---

## Step 4: Create Test Fixture (Scene with Entities)

Create a simple test scene manually in Doppio, or via script:

```python
#!/usr/bin/env python3
import json

# Create a simple scene with 3 cube entities
scene = {
    "entities": [
        {
            "id": 1,
            "name": "Cube1",
            "components": {
                "Transform": {"position": [0, 0, 0], "scale": [1, 1, 1]},
                "MeshFilter": {"primitive": "Cube"}
            }
        },
        {
            "id": 2,
            "name": "Cube2",
            "components": {
                "Transform": {"position": [2, 0, 0], "scale": [1, 1, 1]},
                "MeshFilter": {"primitive": "Cube"}
            }
        },
        {
            "id": 3,
            "name": "Cube3",
            "components": {
                "Transform": {"position": [4, 0, 0], "scale": [1, 1, 1]},
                "MeshFilter": {"primitive": "Cube"}
            }
        }
    ]
}

with open('/tmp/test_scene.caf', 'w') as f:
    json.dump(scene, f)

print("Created test_scene.caf")
```

---

## Step 5: Run Tests

```bash
# Make the test script executable
chmod +x /home/pedro/repo/caffeine/tests/editor_test_automation.py

# Run tests against the Doppio binary with a test scene
DOPPIO_TEST_MODE=1 python3 /home/pedro/repo/caffeine/tests/editor_test_automation.py \
    /home/pedro/repo/caffeine/build/doppio \
    /tmp/test_scene.caf
```

---

## Example Output

```
[DEBUG] 2026-05-24 00:15:30 - Launching: /home/pedro/repo/caffeine/build/doppio --scene /tmp/test_scene.caf
[INFO] 2026-05-24 00:15:30 - Process started with PID 12345

============================================================
TEST: Scene Load
============================================================
[INFO] 2026-05-24 00:15:31 - Waiting for pattern: 'Scene loaded' (timeout: 15s)
[INFO] 2026-05-24 00:15:32 - ✓ Found pattern: Scene loaded: /tmp/test_scene.caf
[INFO] 2026-05-24 00:15:32 - ✓ Scene loaded successfully

============================================================
TEST: Entity Selection (ID: 1)
============================================================
[INFO] 2026-05-24 00:15:32 - Sending command: select_entity 1
[INFO] 2026-05-24 00:15:32 - Waiting for result: selected_entity
[INFO] 2026-05-24 00:15:32 - ✓ Result: {'key': 'selected_entity', 'id': 1}
[INFO] 2026-05-24 00:15:32 - ✓ Entity 1 selected successfully

============================================================
TEST SUMMARY
============================================================
Passed: 5
Failed: 0
Total:  5
Pass Rate: 100.0%
============================================================
```

---

## How to Add New Tests

1. **Write a new test method in `EditorTestSuite` :**

```mermaid
flowchart TD
  def_test_your_feature_self__arg1__int___["def test_your_feature(self, arg1: int) -> bool:"] --> ___Test__Your_feature_description____[""""Test: Your feature description.""""]
  ___Test__Your_feature_description____[""""Test: Your feature description.""""] --> logger_info___n________60_["logger.info("\n" + "="*60)"]
  ___Test__Your_feature_description____[""""Test: Your feature description.""""] --> logger_info__TEST__Your_Feature__["logger.info("TEST: Your Feature")"]
  ___Test__Your_feature_description____[""""Test: Your feature description.""""] --> logger_info_____60_["logger.info("="*60)"]
  ___Test__Your_feature_description____[""""Test: Your feature description.""""] --> __Send_command["# Send command"]
  ___Test__Your_feature_description____[""""Test: Your feature description.""""] --> if_not_self_harness_send_test_command_f_["if not self.harness.send_test_command(f"your_command {arg1}"):"]
  if_not_self_harness_send_test_command_f_["if not self.harness.send_test_command(f"your_command {arg1}"):"] --> logger_error____Failed__["logger.error("✗ Failed")"]
  logger_error____Failed__["logger.error("✗ Failed")"] --> self_failed____1["self.failed += 1"]
  logger_error____Failed__["logger.error("✗ Failed")"] --> return_False["return False"]
  ___Test__Your_feature_description____[""""Test: Your feature description.""""] --> __Get_result["# Get result"]
  ___Test__Your_feature_description____[""""Test: Your feature description.""""] --> result___self_harness_get_result__your_r["result = self.harness.get_result("your_result_key")"]
  ___Test__Your_feature_description____[""""Test: Your feature description.""""] --> if_not_result_or_not_result_get__success["if not result or not result.get('success'):"]
  if_not_result_or_not_result_get__success["if not result or not result.get('success'):"] --> logger_error____Feature_didn_t_work__["logger.error("✗ Feature didn't work")"]
  logger_error____Feature_didn_t_work__["logger.error("✗ Feature didn't work")"] --> self_failed____1["self.failed += 1"]
  logger_error____Feature_didn_t_work__["logger.error("✗ Feature didn't work")"] --> return_False["return False"]
  ___Test__Your_feature_description____[""""Test: Your feature description.""""] --> logger_info____Feature_works___["logger.info("✓ Feature works!")"]
  ___Test__Your_feature_description____[""""Test: Your feature description.""""] --> self_passed____1["self.passed += 1"]
  ___Test__Your_feature_description____[""""Test: Your feature description.""""] --> return_True["return True"]
```


2. **Add instrumentation in Doppio** (for your new feature)

3. **Call test from `main()` :**

```python
suite.test_your_feature(42)
```

---

## Troubleshooting

### "Process not running" error
- Check if Doppio crashes on startup
- Run manually: `DOPPIO_TEST_MODE=1 ./doppio`
- Check stderr output

### "Timeout waiting for pattern"
- Scene might not be loading
- Check if test scene file exists
- Add more logging to SceneViewport.cpp

### "Failed to send command"
- stdin might be closed
- Check if Doppio is still running
- Verify test mode is enabled (DOPPIO_TEST_MODE=1)

---

## Integration with CI/CD

Add to `.github/workflows/test.yml` :

```yaml
- name: Run Editor Tests
  run: |
    cd /home/pedro/repo/caffeine
    DOPPIO_TEST_MODE=1 python3 tests/editor_test_automation.py \
        ./build/doppio \
        ./tests/fixtures/test_scene.caf
```

---

## Next Steps

1. ✅ Integrate `TestInstrumentation.hpp` into SceneViewport.cpp
2. Implement stdin command parsing
3. Create test fixture scene
4. Run tests
5. For each new feature: Add test method → Add instrumentation → Verify

---

## File Locations

- **Test Framework**: `/home/pedro/repo/caffeine/tests/editor_test_automation.py`
- **Instrumentation Header**: `/home/pedro/repo/caffeine/src/editor/TestInstrumentation.hpp`
- **Test Fixtures**: `/home/pedro/repo/caffeine/tests/fixtures/`
- **This Guide**: `/home/pedro/repo/caffeine/docs/editor/test-automation.md`

