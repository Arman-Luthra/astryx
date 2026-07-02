---
'@astryxdesign/core': patch
---

[fix] ClickableCard: remove the faint 1px border ring that appeared on hover for non-`default` variants (blue, muted, transparent, etc.). The hover/active feedback now tints the card's own background instead of layering an overlay, so it covers the full card including the border.
@kentonquatman
