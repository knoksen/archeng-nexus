# Security Policy

## Supported Versions

This project is currently a prototype. Security fixes are applied to the
current default branch; no older release support window is promised.

## Reporting a Vulnerability

Please report suspected vulnerabilities privately through GitHub's security
advisory feature for this repository, if available. If private reporting is not
enabled, contact the repository maintainers directly rather than posting
exploit details in a public issue. Include the affected version or commit and
reproduction steps; do not include real user data or credentials.

The desktop app starts its HTTP server on loopback with an ephemeral port,
enables Electron sandboxing and web security, and opens only validated HTTP(S)
external links. The demo contact endpoint does not persist or log submissions.
These controls do not replace a security review before a production backend
stores or delivers contact data.
