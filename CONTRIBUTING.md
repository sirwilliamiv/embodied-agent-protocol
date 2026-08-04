# Contributing to the Embodied Agent Protocol

EAP is a draft protocol. The most valuable contribution right now is
an independent implementation and the issues it surfaces.

- **Implementers:** build any role (Stage, Stage Manager, Director, Cast) and
  file issues describing where the spec was ambiguous, wrong, or silent.
  Claim conformance per CONFORMANCE.md wording.
- **Spec changes:** open an issue before a PR. Normative changes (MUST/SHOULD)
  require a rationale and at least one implementation willing to adopt them.
  The never-click rule (SPEC.md section 8) is foundational; proposals to add
  actuation capabilities to 0.x will be declined.
- **Schemas:** must validate under JSON Schema draft 2020-12; `npm test`
  compiles all schemas and validates the examples.

Spec text is CC BY 4.0; schemas, examples, and tooling are MIT. By
contributing you license your contribution under the same terms.
