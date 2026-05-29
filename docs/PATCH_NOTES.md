# Patch Notes

## v1.1

- Restored full admin tab layout.
- Kept ZIP cluster engine as the main foundation.
- Fixed dangerous fallback behavior:
  - Unknown ZIPs now resolve to UNKNOWN_CLUSTER.
  - Unknown ZIPs no longer default to MOUNTAIN_REMOTE.
- Added exact ZIPs:
  - 92843 → SOCAL_CORE
  - 10001 → NORTHEAST_CORE
- Added broader prefix rules:
  - 928 → SOCAL_CORE
  - 100–109 → NORTHEAST_CORE
  - 110, 115–119 → LONG_ISLAND_HARD
- Added placeholder panels for old admin tabs so the structure is not lost.
