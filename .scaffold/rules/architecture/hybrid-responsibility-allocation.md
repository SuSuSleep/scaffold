# architecture.hybrid-responsibility-allocation

## Applies When

- Defining, reconstructing, implementing, or reviewing a solution that combines agent-executed adaptive behavior with deterministic programs
- A Skill guides an agent to invoke a tool or depends on host-specific installation or configuration

## Guidance

- Assign each material adaptive, deterministic, and integration Responsibility explicitly. The existing agent host executes adaptive behavior; a Skill is an instruction artifact that guides it rather than an independent runtime.
- Assign exact, repeatable operations to deterministic tools or bridges when that allocation provides useful correctness, speed, reuse, or direct system access. Keep contextual selection, interpretation, and semantic judgment with the Skill-guided agent when those behaviors are intentionally adaptive.
- Record material agent-to-Skill, agent-to-tool, and host-integration Interfaces and dependencies. Include allocation rationale and applicable authority, configuration ownership, failure, and partial-result behavior when they matter to safe operation or future change.
- Keep installation, tool exposure, and bounded host-configuration mutation distinct from both adaptive agent execution and the deterministic operation being exposed.
- Define bounded verification for deterministic behavior and Skill-guided scenarios, plus integration evidence when independently checked parts must interoperate. Keep the real agent-tool interaction in scope when that boundary is the verification target.
- Do not require a project to add AI, implement its own agent runtime, adopt an additional vendor adapter, or introduce a machine-readable tool manifest merely to satisfy this Rule.
