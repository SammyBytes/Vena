# 🍷 Vena

**Vena** is a local-first database orchestrator designed to bring the Git branching experience to the world of relational databases.

> [!NOTE]
> **Hobby Project:** Vena started as a personal experiment to simplify workflow with MariaDB/MySQL in local development environments (especially on Arch Linux). It is not a network proxy, it is a context manager.

###  The Purpose

Vena's goal is to eliminate the friction of switching branches in Git and having your database “fall behind.” Instead of dealing with manual migrations or shared databases that get messy, Vena allows each branch of your code to have its own physical “clone” of the database automatically.

**How does it work?**

1. **Isolate:** Create separate physical databases for each branch.
2. **Synchronize:** Maintain a history of changes in human-readable `.sql` files (inside `.vana/migrations`).
3. **Automate:** Patches your configuration files (`appsettings.json`, `.env`) so your app always points to the correct database.

### Simple Architecture

Vena uses **libSQL** locally to manage state (which branch you are using, which physical database corresponds to it) without the need for cloud services. Everything lives inside your `.vana/` folder.

### Installation and Use

To install dependencies:

```bash
bun install

```

To initialize a project:

```bash
# Create the .vana structure and configure the engine (mariadb/mysql)
bun run src/index.ts init <project_name> <engine>

```

To run development mode:

```bash
bun run src/index.ts

```

### Roadmap (Stages)

* [x] **Stage 1:** Base infrastructure, JSON configuration, and local status with LibSQL.
* [ ] **Stage 2:** Engine drivers (MariaDB) and physical branch management.
* [ ] **Stage 3:** Schema snapshots and democratic versioning.
* [ ] **Stage 4:** Deep integration with Git Hooks.

### Tech Stack

* **Runtime:** [Bun](https://bun.sh) v1.3.6 (Fast all-in-one JavaScript runtime).
* **State Manager:** [libSQL](https://github.com/tursodatabase/libsql) (SQLite fork) for local metadata management.
* **Target Engines:** MariaDB / MySQL.
