# Smart Rate V1 Cluster Engine

This version starts the real pricing foundation.

## Principle

Every ZIP must resolve to a freight cluster.

The cluster carries:

- friction value
- confidence baseline
- freight anchor
- topology tags
- examples
- operational notes

## Why this matters

Pricing should not be based only on distance. The Montway calibration data repeatedly showed that freight pricing is driven by:

- reload probability
- deadhead exposure
- mountain/coastal/peninsula access
- congestion
- carrier density
- directionality
- seasonality

## Next Steps

1. Expand ZIP mapping using the final normalized quote archive.
2. Generate lane anchor tables by cluster pair.
3. Calibrate friction values against Montway and Orange Auto Transport history.
4. Add vehicle burden, enclosed, non-running, and date bucket layers.
