# Getting started

This section covers the shortest path from a fresh clone to a running Doppio
session, plus the platform build automation.

![Doppio project manager](../images/captures/doppio-startup.png)

## Recommended path

1. **Clone with submodules**

   ```bash
   git clone --recurse-submodules git@github.com:devscafecommunity/caffeine.git
   cd caffeine
   ```

2. **Configure and build**

   ```bash
   cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
   cmake --build build -j
   ```

3. **Run Doppio**

   ```bash
   ./build/doppio
   ```

4. **Optional: build the editor plugins**

   ```bash
   cmake -S doppio-plugins -B doppio-plugins/build -DCAFFEINE_ROOT="$PWD"
   cmake --build doppio-plugins/build -j
   ```

   Copy the resulting libraries to a `plugins/` directory and enable them from
   **Plugins → Plugin Manager**.

## Pages

| Page | Contents |
|------|----------|
| [Build guide](build-guide.md) | `caffeine-build` wrapper: configure, build, rebuild, test, run |
| [Quick start](quick-start.md) | First project and scene |
| [Building](building.md) | Manual CMake options and platform requirements |
| [Contributing](contributing.md) | Coding rules and review checklist |

## Requirements

| Dependency | Version |
|------------|---------|
| CMake | 3.20+ |
| C++ | C++20 |
| SDL | SDL3 |
| Compiler | GCC 12+, Clang 15+, MSVC 19.3+ |

The engine fetches ImGui and other pinned dependencies during configure. No system
ImGui install is required.
