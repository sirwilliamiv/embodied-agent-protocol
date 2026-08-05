# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| 0.1-draft | yes |

EAP is a draft protocol specification. The security-relevant surface is the
spec itself (consent semantics, the never-click rule, transform staleness
rules) and the validation tooling in this repo.

## Reporting a Vulnerability

- **Spec-level issues** (a reading of the spec that would let an implementation
  bypass consent, actuate on the user's behalf, or spoof another role): open a
  regular GitHub issue — the spec is public, and so should be the discussion.
- **Tooling vulnerabilities** (something exploitable in `tools/` or CI): use
  [GitHub private vulnerability reporting](../../security/advisories/new)
  so it can be fixed before disclosure.

You can expect an initial response within a week. Please do not open public
issues for exploitable tooling problems before they are fixed.
