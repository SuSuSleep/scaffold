---
name: collect-context
description: Find and substantiate evidence for a caller-defined search target and completion criteria. Use when a request or work phase needs targeted context.
---

# Collect Context

## Inputs

The caller defines what to find, what evidence is sufficient for its decision or outcome, and any applicable scope or source-authority constraints. These inputs may be expressed in the request or work phase; no separate parameter format is required. Return a missing essential input to the caller rather than inventing a different search assignment.

## Method

1. Use the supplied target to locate a small set of likely sources. Search by the subject and behavior being investigated, not only by a guessed name or path.
2. Read enough surrounding context to substantiate a claim and its conditions. Follow references or dependencies and expand the search only when a material gap or contradiction prevents satisfying the supplied criteria.
3. Check the effective search paths, filters, errors, and truncation before drawing a negative conclusion. An incomplete or failed search is not evidence of absence.
4. Compare relevant sources using the caller's authority and applicability constraints. Distinguish direct observations, inferences, and what inspected tests actually assert; inspection is not completed execution or verification.
5. Return the evidence-backed findings and source locations, material assumptions, unresolved conflicts or gaps, and whether the completion criteria are met. Stop when they are met; leave unresolved direction to the caller rather than silently changing the target.
