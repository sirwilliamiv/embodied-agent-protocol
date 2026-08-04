# EAP 0.1 Conformance

Claim conformance per role. Wording: "EAP 0.1 <Role> (<kind>), capabilities: <list>".

## Stage Manager

| Level | Requirement |
|---|---|
| MUST | Track exactly one location and one owning stage per actor |
| MUST | Refuse crossings involving a stale stage (transform older than 3 s) |
| MUST | Gate summon on host-level user consent; treat MCP tool approval as the consent artifact |
| MUST | Schedule crossing handoffs so exit and entry land the same frame within 2 px in screen space |
| MUST | Honor user dismissal instantly, overriding any running verb |
| MUST | Reject verb payloads that request actuation (never-click, SPEC 8) |
| SHOULD | Expose the verbs as MCP tools (SPEC 6.8) |
| SHOULD | Persist consent artifacts locally and make them inspectable |
| MAY | Support multiple concurrent casts (multi-actor scenes) |

## Stage (any kind)

| Level | Requirement |
|---|---|
| MUST | Register with kind, capabilities, doors, and a valid transform |
| MUST | Heartbeat the transform at >= 1 Hz and on resize, move, or zoom |
| MUST | Only accept verbs matching declared capabilities |
| MUST | Render entrance and exit choreography for its doors |
| MUST NOT | Synthesize input on the surface it inhabits (scroll-into-view during traverse excepted, user-interruptible) |
| SHOULD | Resolve targets via accessibility tree before text, landmark, then selector |
| SHOULD | Emit target.outcome after each point (the ledger) |
| SHOULD | Prefer target_lost over low-confidence pointing |
| MAY | Implement spotlight, occlusion handling, posture rendering |

## Director

| Level | Requirement |
|---|---|
| MUST | Address stages by id; never send raw coordinates as targets |
| MUST | Handle consent_denied and stage_stale without retry-hammering |
| MUST | Supply real grounding confidence with speak when using posture |
| SHOULD | Use descriptors with role + name at minimum |
| SHOULD | Sequence verbs on acknowledgment, not on wall-clock guesses |
| MAY | Pre-plan routes from cached recipes ("it is three clicks from here, follow me") |

## Cast

| Level | Requirement |
|---|---|
| MUST | Ship measured anchor metrics (foot line, palm line, scale) with the sprite set |
| MUST | Include walk, idle, and point animations |
| MUST | Bind speech to a grounding endpoint (no free-running character voice) |
| SHOULD | Include enter, exit, sit, and gesture sets |
| MAY | Ship stage dressing (themes for pages that host the actor) |
