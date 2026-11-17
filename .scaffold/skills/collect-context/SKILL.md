---
name: collect-context
description: Find evidence and derive supported conclusions for a caller-defined search target and completion criteria. Use when a request or work phase needs targeted context.
---

# Collect Context

## Inputs

The caller defines what to find, what evidence is sufficient for its decision or outcome, and any applicable scope or source-authority constraints. These inputs may be expressed in the request or work phase; no separate parameter format is required. Return a missing essential input to the caller rather than inventing a different search assignment.

## Method

1. Use the supplied target to locate a small set of likely sources. Search by the subject and behavior being investigated, not only by a guessed name or path.
2. Read enough surrounding context to substantiate a claim and its conditions. Follow references or dependencies and expand the search only when a material gap or contradiction prevents satisfying the supplied criteria.
3. Check the effective search paths, filters, errors, and truncation before drawing a negative conclusion. An incomplete or failed search is not evidence of absence.
4. Compare relevant sources using the caller's authority and applicability constraints. Distinguish direct observations, inferences, and what inspected tests actually assert; inspection is not completed execution or verification.
5. Return the result below. Stop when the supplied completion criteria are met; leave unresolved direction to the caller rather than silently changing the target.

## Result

Use a format appropriate to the caller's request, with these distinctions explicit:

- **Observations:** facts directly established by the inspected sources, with source locations.
- **Inferences:** conclusions that answer the supplied target, linked to their supporting observations and evidence. Give a concise rationale and the material assumptions or conditions under which each conclusion holds. Distinguish supported conclusions from unverified hypotheses; when no inference is warranted or the evidence is insufficient, say so rather than inventing a conclusion.
- **Limits and completion:** unresolved conflicts, gaps, or unknowns that could change the conclusions, and whether the caller's completion criteria are met.
