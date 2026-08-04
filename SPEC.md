# Stagecraft Protocol Specification

**Version 0.1-draft · August 2026**

The key words MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY are to be interpreted as in RFC 2119.

---

## 1. Design principles

1. **Visible intention before action.** The actor's movement announces what is about to happen before it happens. Dead time is choreography: where the actor walks predicts the answer.
2. **Deixis, not actuation.** The actor points; the human clicks. (Section 8, normative.)
3. **Consent at every entrance.** An actor appears on a user's screen only through an explicit, user-approved summons. Exits are graceful; the actor changes rooms, it does not die.
4. **Grounded speech.** What the actor says carries receipts. Confidence expressed by the body MUST reflect real confidence supplied by the Director; posture is calibration made visible, never theater.
5. **Degrade gracefully.** Every scene has a defined fallback when a surface is missing: full stage, page-only, chat-only.

## 2. Terminology

| Term | Meaning |
|---|---|
| **Actor** | The embodied character. One actor exists in exactly one place at a time. |
| **Stage** | A surface that can host the actor: a desktop overlay, a web page, a browser tab (via extension). |
| **Stagehand** | The adapter code that makes a surface a Stage: publishes geometry, resolves targets, draws the actor or its effects. |
| **Stage Manager** | The coordinator. Single source of truth for where the actor is, who owns it, and whether a crossing is safe. |
| **Director** | The intelligence issuing verbs: an agent, an MCP client, or a script. |
| **Cast** | A packaged character: sprites, metrics, corpus binding, voice. (Schema: cast.schema.json.) |
| **Door** | A named anchor where an actor may enter or leave a stage. |
| **Anchor** | A named point on a stage in screen space (door, ledge, element:...). |

## 3. Topology

```
            Director (agent / MCP client)
                      | verbs (6)
                      v
               Stage Manager
              /       |        \        state: actor location,
             v        v         v       ownership, scene, consent
      Stage A      Stage B    Stage C
   (desktop     (web page)  (extension
    overlay)                  tab)
```

- Exactly one Stage Manager per user session. It MAY run locally (reference: a localhost service).
- Stages register with the Stage Manager; Directors address stages by id, never by raw coordinates.
- The Stage Manager is the only component that may authorize a crossing.

## 4. Coordinate model (the heart of the protocol)

All positions are expressed in **global screen space**: device-independent pixels in the OS virtual-desktop coordinate system, top-left origin of the primary display.

Every Stage MUST publish a **transform** mapping its local coordinates to screen space:

```
transform = { originX, originY, dpr, viewportW, viewportH, chromeOffsetY, ts }
```

- A web-page Stage computes origin from window.screenX/screenY plus measured browser-chrome offset; an overlay Stage reads window geometry from the OS.
- **Heartbeat:** every Stage MUST republish its transform at >= 1 Hz and immediately on resize, move, or zoom.
- **Staleness:** a transform older than 3 seconds marks the stage **stale**. The Stage Manager MUST NOT authorize a crossing to or from a stale stage, and SHOULD pause an actor mid-walk toward one.
- **Multi-display:** stages spanning displays with different scale factors MUST publish per-display transforms; the Stage Manager resolves a point through the display that contains it.
- **Anchors** are named screen-space points published with the transform (e.g. `door`, `ledge`). Element anchors resolve on demand (section 7).

Crossings are the acceptance test of this section: at handoff, the exit fade on stage A and the entry spawn on stage B MUST be scheduled for the same frame time, at positions that agree within 2 px in screen space, with facing and gait continuous.

## 5. Message layer

Transport between Stages, Directors, and the Stage Manager is a bidirectional channel (WebSocket, or SSE plus POST). Every message uses the envelope (envelope.schema.json):

```json
{ "v": "0.1", "id": "uuid", "ts": 1723000000000,
  "from": { "role": "stage|director|manager", "stageId": "..." },
  "type": "stage.hello", "payload": { } }
```

Message types:

| Type | Direction | Purpose |
|---|---|---|
| stage.hello | stage -> manager | Register: kind, capabilities, transform, doors |
| stage.transform | stage -> manager | Heartbeat / geometry update |
| stage.bye | stage -> manager | Clean exit; manager relocates or retires the actor |
| actor.state | manager -> all | Position, pose, facing, confidence, owner stage |
| verb.* | director -> manager | The six verbs (section 6) |
| target.resolve | manager -> stage | Ask a stagehand to resolve a descriptor |
| target.resolved / target.lost | stage -> manager | Result with bbox, strategy, confidence |
| target.outcome | stage -> manager | Ledger: did the human act where pointed (section 7.3) |
| consent.requested / granted / denied | manager <-> host | Entrance and scope consent |
| error | any -> caller | Typed failure (section 9) |

## 6. The verbs

Six verbs. Params in verbs.schema.json. Every verb returns an acknowledgment with a requestId; progress and completion arrive as events.

### 6.1 summon
Bring the actor onto a stage through a door. **Preconditions:** user consent (6.7), target stage fresh. **Effects:** entrance choreography, actor ownership assigned. **Failures:** consent_denied, stage_stale, already_present.

### 6.2 cross
Move the actor from its current stage to another, walking to the departure door, handing off per section 4. **Failures:** stage_stale, no_route, occluded.

### 6.3 point
Walk to and indicate a target (descriptor, section 7). Style: `stand` (body only), `spotlight` (stagehand highlights the element), or `both`. The actor waits at the target until released or timeout. **This verb draws attention; it MUST NOT actuate.**

### 6.4 traverse
Move through an ordered list of targets or a document structure (e.g. headings), pointing at each. Scroll is performed by the stagehand as presentation (bringing the target into view), which is the single sanctioned exception to "the actor never manipulates the page," and it MUST be interruptible by the user's own scroll at all times.

### 6.5 speak
Display an utterance with receipts: `{ text, receipts: [{quote, sourceUrl}], confidence }`. Stages render speech near the actor. A Director SHOULD send confidence; the actor's posture reflects it (6.9).

### 6.6 retire
Exit: through a door (`via: "door"`, optionally naming an exit stage to cross into first), or fade. Retire is never abrupt when a graceful path exists; the close button is an exit, not a death.

### 6.7 Consent (normative)
- summon MUST be gated on explicit user approval in the host that initiates it. When the Director is an MCP client, the tool-call approval IS the consent artifact, and the summon tool MUST NOT be marked auto-approvable.
- Scope of consent: one stage set, one session. New stage kinds (e.g. first entry into a browser tab) require re-consent.
- The user can always dismiss the actor instantly (panic gesture); dismissal overrides any running verb.

### 6.8 MCP binding
Verbs bind as MCP tools on a Stage Manager exposed as an MCP server: `stage_summon`, `stage_cross`, `stage_point`, `stage_traverse`, `stage_speak`, `stage_retire`. All are annotated readOnlyHint: false only where they alter the scene; none carry destructiveHint (nothing is destructive, because nothing actuates); summon is the consent gate. This binding makes any MCP host a Director with zero new plumbing.

### 6.9 Posture extension (optional)
If implemented: confidence in [0,1] maps to gait and idle vocabulary (stride / walk / slow / stop-and-look). The mapping MUST be monotone and MUST source confidence from the Director's grounding pipeline. Fabricating confident posture over ungrounded speech is non-conformant.

## 7. Targets: descriptors, resolution, the ledger

### 7.1 Descriptor (descriptor.schema.json)
A target is described by durable properties, never by a bare CSS selector:

```json
{ "role": "button", "name": "Cancel subscription",
  "textNear": "Membership", "landmark": "main",
  "selector": "optional last resort", "tabId": "...", "bboxHint": null }
```

### 7.2 Resolution
Stagehands resolve descriptors against the live surface, preferring, in order: accessibility tree (role + accessible name), text proximity, landmark-relative position, selector. The response carries `{ bbox, strategy, confidence }` in screen space. Resolution below a confidence floor SHOULD produce target_lost rather than a guess: a body pointing at empty space is the protocol's worst failure and honest failure beats it.

### 7.3 The outcome ledger
After a point, the stagehand SHOULD emit `target.outcome`: whether the user acted on the indicated element and within what time. Keyed by (app, appVersionHint, descriptor, strategy), this ledger is how an implementation learns which resolution strategies actually work. The ledger is local-first and private by default.

## 8. The never-click rule (normative)

An actor MUST NOT synthesize clicks, keystrokes, form input, navigation, or any other actuation on a stage it inhabits or points at. The sanctioned exceptions are presentation only: scrolling a target into view during traverse (interruptible, 6.4) and the actor's own visual effects (spotlight, speech). There is no negotiated actuation capability in protocol version 0.x, and implementations MUST reject verb payloads attempting to smuggle one.

## 9. Errors

`consent_denied · stage_stale · target_not_found · target_ambiguous · occluded · no_route · already_present · unsupported_capability`. Every error names the failed precondition and, where sensible, what would repair it.

## 10. Capabilities and degradation

stage.hello declares capabilities: `{ geometry, scroll, spotlight, a11yTree, video }`. Directors MUST NOT issue verbs a stage did not declare. The degradation ladder is: full (overlay + page + extension) -> page-only (actor lives in web stages) -> chat-only (verbs render as text and receipts, e.g. via MCP Apps). A scene MUST define its floor and render there without error.

## 11. Casts

A cast (cast.schema.json) packages: sprite sheets with measured metrics (frame size, anchor points such as palmLineY and footY, scale), animation map (walk, idle, sit, point, gesture set), corpus binding (the grounding endpoint the actor speaks from), and voice/copy rules. Metrics exist so stages can seat, align, and point the body precisely; a cast without measured anchors is decorative, not conformant.

## 12. Security and privacy

- Local-first: geometry, ledger, and scene state stay on the user's machine unless the user opts otherwise.
- A stagehand exposes element *geometry and names*, not page content wholesale; extension permissions are per-site and minimal.
- All consent artifacts are logged locally and inspectable.
- The Stage Manager binds to localhost by default and authenticates stages with a per-session token.

## 13. Versioning and conformance

Envelope `v` is the protocol version. 0.x revisions may break; from 1.0, additive only. Conformance is per role, defined in CONFORMANCE.md. An implementation claims, e.g., "Stagecraft 0.1 Stage (web-page), capabilities: geometry, spotlight."

---

## Appendix A: a minimal scene

```
director: verb.summon {castId:"billy", stageId:"desktop", door:"rain-door"}
manager:  consent.requested -> host approves (MCP tool approval)
manager:  actor.state {stage:"desktop", pose:"enter"}
director: verb.cross {toStageId:"page-hirebilly"}
manager:  (checks both transforms fresh; schedules matched handoff)
stages:   exit fade / entry spawn, same frame, same screen point
director: verb.point {target:{role:"button", name:"Ask Billy"}, style:"both"}
stage:    target.resolved {bbox, strategy:"a11y", confidence:0.93}
stage:    target.outcome {clickedWithinMs: 2400, taskCompleted: true}
```

## Appendix B: reference implementation map (hire-billy, Aug 2026)

| Spec concept | Implementation |
|---|---|
| Stage Manager | serve.js stage-manager channel (SSE/WebSocket) |
| Desktop overlay Stage | transparent always-on-top overlay; window geometry from OS; ledge anchor from measured palm line |
| Web-page Stage | hire-billy stage page; door position self-reported at 1 Hz (the heartbeat rule generalizes this) |
| cross | the desktop-to-page crossing with same-frame fade/spawn |
| summon consent | MCP summon tool call approval in the host |
| Cast metrics | sprite palm-line and seat calibration (the 99px figure-space measurement) |
| Not yet implemented | extension-tab Stage (the "stagehand"), point/traverse against arbitrary tabs, outcome ledger |
