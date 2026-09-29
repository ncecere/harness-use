#!/usr/bin/env bash
# Install a reviewed subset of K-Dense Scientific Agent Skills into this project.
#
# Usage:
#   ./scripts/install-research-skills.sh            # core skills only
#   ./scripts/install-research-skills.sh --extended # core + skills that use paid/external search services
#
# Skills are copied into .agents/skills/<name>/, where OpenCode discovers them.
# Review each SKILL.md before use. Skills can instruct the agent to run code,
# install packages, and contact external services.

set -euo pipefail

REPO_URL="https://github.com/K-Dense-AI/scientific-agent-skills.git"
REPO_TAG="v2.69.0"

# No API keys required. These use public scholarly APIs or local processing.
CORE_SKILLS=(
  paper-lookup
  citation-management
  database-lookup
  scientific-critical-thinking
  scientific-writing
  liteparse
  markitdown
  exploratory-data-analysis
  statistical-analysis
)

# These rely on external search services (for example Parallel, Exa, or OpenRouter)
# and may require separate accounts and API keys.
EXTENDED_SKILLS=(
  research-lookup
  literature-review
  parallel-web
  exa-search
)

skills=("${CORE_SKILLS[@]}")
if [[ "${1:-}" == "--extended" ]]; then
  skills+=("${EXTENDED_SKILLS[@]}")
fi

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
target="$project_root/.agents/skills"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

echo "Downloading scientific-agent-skills $REPO_TAG..."
git -c advice.detachedHead=false clone --quiet --depth 1 --branch "$REPO_TAG" "$REPO_URL" "$tmp/repo"

mkdir -p "$target"
for skill in "${skills[@]}"; do
  src="$tmp/repo/skills/$skill"
  if [[ ! -f "$src/SKILL.md" ]]; then
    echo "  skipped $skill (not found in $REPO_TAG)" >&2
    continue
  fi
  rm -rf "${target:?}/$skill"
  cp -R "$src" "$target/$skill"
  echo "  installed $skill"
done

cp "$tmp/repo/LICENSE.md" "$target/SCIENTIFIC-AGENT-SKILLS-LICENSE.md"

echo
echo "Installed ${#skills[@]} skills into $target"
echo "Restart OpenCode, then run: opencode debug skill"
