# 🍷 Vena

**Vena** is a local-first database orchestrator designed to bring the Git branching experience to the world of relational databases.

> [!IMPORTANT]
> **Context Manager, not a Proxy:** Vena doesn't sit between your app and the DB. It manages the physical infrastructure and schema state so your database follows your code, not the other way around.

### The Purpose

Vena eliminates the friction of switching Git branches and finding your database "out of sync". Instead of manual migrations or messy shared databases, Vena ensures each code branch has its own **isolated physical clone**.

1. **Isolate:** Automatic creation of empty-schema clones for new branches.
2. **Snapshot:** Capture schema changes as deterministic `.sql` migrations.
3. **Synchronize:** Use **Bun.hash** to detect "dirty" schemas and sync with teammates via Git.

### Architecture

Vena uses **libSQL** (SQLite) locally to maintain a "Source of Truth" (`.vena/state.db`). It maps your Git branches to physical MariaDB/MySQL databases and tracks which migrations have been applied to your local environment.

### CLI Commands

```bash
# Initialize Vena in your project
$ vena init <project_name> <engine> [host] [port] [user] [pass]

# Create a new branch (Clones structure, no data)
$ vena branch <branch_name>

# Save current schema changes to a migration file
$ vena commit <name> [description]

# Check current branch and pending migrations
$ vena status

```

### Roadmap (Stages)

* [x] **Stage 1:** Base infrastructure and LibSQL state management.
* [x] **Stage 2:** MariaDB Drivers & Physical Branching.
* [x] **Stage 3:** Vena Status & Metadata Tracking.
* [x] **Stage 4:** **Schema Versioning (In Progress)**
    * [x] Deterministic Snapshots (`--skip-comments`).
    * [x] Content-based Hashing with `Bun.hash`.
    * [ ] Migration Apply/Sync logic.


* [ ] **Stage 5:** Deep Integration (Git Hooks & Config Patching).

### Tech Stack

* **Runtime:** [Bun](https://bun.sh) (Fast all-in-one JavaScript runtime).
* **State Manager:** [libSQL](https://github.com/tursodatabase/libsql) for local metadata.
* **Target Engines:** MariaDB / MySQL.
* **Philosophy:** Learning in Public & Digital Gardening.