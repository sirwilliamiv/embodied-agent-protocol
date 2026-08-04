# Changelog

## Unreleased

- Boundary diagram (docs/boundary.svg) and an MCP/EAP ownership table in the
  README: the chat pane is MCP's domain, the screen beyond its edge is EAP's,
  and the seam is verbs bound as MCP tools (6.8).
- Reference implementation grew upstream input (the viewer types at the actor,
  the Director hears it) and director speech through the actor — candidates
  for a user.utterance message and the speak verb binding in 0.2.

## 0.1-draft (August 2026)

Initial public draft: six verbs (summon, cross, point, traverse, speak,
retire), global screen-space coordinate model with 1 Hz transform heartbeat
and staleness rules, the never-click rule as a normative trust model,
descriptor-based targeting with the outcome ledger, consent semantics bound
to MCP tool approval, cast packaging with measured anchor metrics, and
per-role conformance checklists.

Criteria for 0.2: at least one independent second implementation, and
implementation experience from an extension-tab Stage (point/traverse against
arbitrary tabs).
