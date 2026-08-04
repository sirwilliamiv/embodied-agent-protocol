# Embodied Agent Protocol (EAP)

**An open protocol for embodied agents.** Draft 0.1, August 2026.

*MCP gives an agent context. EAP gives it a body.*

Agents can already act. What they cannot do is be **seen deciding**: attention, intention, and confidence all live in scrolling text. EAP gives an agent a body on the user's screen: a character that is summoned by consent, walks across real surfaces (the OS desktop, a web page, a browser tab), points at real UI elements, and hands off between surfaces with pixel agreement, so one continuous character can cross from the operating system into a website.

The body is not decoration. It is a consent surface: a body telegraphs intent at human speed, before anything happens, in a form a person can veto by reflex.

## The one rule that defines the protocol

**The actor never clicks.** An embodied agent under EAP points, walks, speaks, and waits. The human acts. Actuation is not a missing feature; its absence is the trust model, and it is normative (see SPEC.md section 8).

## What is in this repo

```
README.md          this file
SPEC.md            the protocol: roles, coordinate model, verbs, consent, conformance
CONFORMANCE.md     MUST / SHOULD / MAY checklists per role
schemas/           JSON Schemas for every message
  envelope.schema.json
  stage.schema.json
  verbs.schema.json
  descriptor.schema.json
  cast.schema.json
```

## How it relates to MCP

EAP is a companion to the Model Context Protocol, not a fork of it. MCP (spec 2026-07-28) carries tools and context; the MCP Apps extension (2026-01-26) renders UI *inside* the chat pane. EAP is the layer for UI *outside* the pane: characters on the desktop and in pages, crossing between them. The EAP verbs bind naturally as MCP tools (section 6.8 of the spec), which makes any MCP client a potential Director, and makes summoning a consented tool call.

## Reference implementation

The [hire-billy](https://github.com/sirwilliamiv/hire-billy) project implements a Stage Manager (serve.js), a desktop-overlay Stage, a web-page Stage with door heartbeat, the summon and cross verbs, and a cast with measured sprite metrics. SPEC.md Appendix B maps the implementation to the protocol.

## Status and license

Draft 0.1: seeking a second independent implementation before 0.2. Spec text intended for CC BY 4.0, schemas MIT, so that anyone can implement without asking. Every copy of this idea should be an implementation of this spec.
