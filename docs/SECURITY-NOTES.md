# Security Notes — residual dependency risk

This note documents **accepted residual risk** that cannot be fixed by version bump alone.
Do not invent a local patch that claims to “fix” these; track upstream and apply mitigations.

## extract-zip (via electron / electron-builder / adm-zip consumers)

| Advisory | Severity | Summary | Patched release |
|----------|----------|---------|-----------------|
| [GHSA-7pqw-9j4j-h8q3](https://github.com/advisories/GHSA-7pqw-9j4j-h8q3) (CVE-2026-19693) | **High** | Symlink + same-name entry allows arbitrary file write outside destination | **none** (`<= 2.0.1`) |
| [GHSA-jmr9-qjv8-65gv](https://github.com/advisories/GHSA-jmr9-qjv8-65gv) (CVE-2026-56876) | **High** | Unvalidated symlink path traversal on extract | **none** (`<= 2.0.1`) |

npm `extract-zip` latest published version is **2.0.1** (no 2.0.2+). Overrides to an unreviewed git fork are **intentionally not applied** — a silent fork pin is higher operational risk than a documented residual for this portfolio/local tool.

### How this package is reached here

- `codedrill` / `desktoppet` ship Electron builds via `electron` + `electron-builder`.
- Toolchain pulls `extract-zip` transitively (asar/electron-builder unpack paths). Application character-pack import in `desktoppet` uses **adm-zip** with its own path guards, not `extract-zip`.

### Mitigations (active)

1. **Never extract untrusted ZIPs with app privileges.** Treat `.pet` / zip character packs and any build-input archives as untrusted.
2. **Path containment is enforced where we control extraction** (desktoppet importer: entry-name sanitization, zip-bomb size caps, root jail). That does **not** neutralize a vulnerable `extract-zip` used only by the toolchain.
3. **Least privilege for packaging.** Build/package as a non-elevated user; do not run `electron-builder` as Administrator/root on untrusted trees.
4. **Track upstream:** watch [max-mapper/extract-zip](https://github.com/max-mapper/extract-zip) / npm for a release `> 2.0.1` that closes GHSA-7pqw-9j4j-h8q3 and GHSA-jmr9-qjv8-65gv, then remove this residual note when Dependabot/`npm audit` is clean.
5. **Do not** `overrides` to a random GitHub tarball “fix” without review — skip unless a vetted fork/PR merges upstream.

### Status

| Item | State |
|------|-------|
| npm patched `extract-zip` release | ❌ not published |
| Local override to git fork | ⏭ skipped (too risky for this repo) |
| Runtime policy (no untrusted extract as admin) | ✅ documented |
| Upstream watch | ✅ this file |

Last reviewed: 2026-09 (portfolio security pass).
