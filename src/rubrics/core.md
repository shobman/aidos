# Core Rubric

Universal quality criteria applied to every AIDOS artifact, at every scale.

---

## Criteria

| # | Criterion | What "Pass" Looks Like |
|---|---|---|
| C1 | Alignment to goals | Every element in the artifact traces to a stated goal or requirement. Nothing is included that doesn't serve a declared purpose. If you can't point to the goal an element serves, it shouldn't be there. |
| C2 | Simplicity | The artifact uses the simplest approach that meets the requirements. Where complexity exists, it is justified — not assumed, inherited, or left over from a previous iteration. |
| C3 | Explicit trade-offs | Trade-offs are named, not hidden. Where a choice was made between alternatives, the options considered, the decision taken, and the reasoning behind it are documented. The reader doesn't have to guess what was sacrificed or why. |
| C4 | Failure modes | The artifact identifies what can go wrong and how those failures are detected or handled. Silence on failure is itself a failure. Each significant component or workflow has its failure path addressed. |
| C5 | Testability | Every claim, requirement, or design choice in the artifact can be verified by a specific action. If you can't describe how you'd test it, you can't audit it. Vague assertions like "the system will be reliable" fail. |
| C6 | Observability | The artifact describes how you would know — in practice, after deployment — whether the thing it describes is working or not. Monitoring, alerting, logging, or health indicators are addressed where relevant. |
| C7 | Security | Security implications are considered and addressed proportionate to the risk. Data handling, access control, attack surface, and regulatory requirements are explicit where relevant. "Not applicable" is stated and justified, not assumed by omission. |
| C8 | Reversibility | The artifact states what can be undone and what can't. Where choices are irreversible — data migrations, public API contracts, third-party commitments — that irreversibility is acknowledged and the decision is justified with appropriate weight. |
| C9 | Future team readiness | Someone unfamiliar with this work could pick up the artifact and understand what was done, why, and what's left. No tribal knowledge required. Context that exists only in someone's head or in a Slack thread is not captured. |
| C10 | Internal consistency | The artifact is internally consistent. Terminology is used the same way throughout, sections don't contradict each other, and the document reads as one coherent unit rather than fragments assembled from different sessions. |
| C11 | Cross-reference, never restate | Each fact lives in exactly one artifact, and every other artifact points to it rather than restating it. The homes are named, not left to judgement: the Problem is the only home of why the work is warranted, the **Solution is the only home of the WHAT**, the **Tech Design is the only home of the HOW**, and Testing is the only home of the evidence standard. A sentence that restates content another artifact owns fails here even when it reads cleanly and is accurate — a Solution paragraph explaining mechanism is a Tech Design sentence sitting in the wrong file, and it fails whether or not it happens to be correct today. The same rule applies within an artifact: a preceding section owns its content and later sections reference it. Evidence: for any concept appearing in more than one artifact, the auditor can name which artifact owns it and confirm the others only point at it. If the same statement appears twice, one of them is wrong or will be soon. See `framework.md` § Artifact Authority. |
| C12 | Single unit of work | The artifact addresses a single deliverable that can be independently understood, built, tested, and released. If it can't, it needs decomposing into sibling artifacts at the same scale level. An artifact that tries to cover too many concerns is a sign that the work hasn't been broken down enough. |
| C13 | Implementation neutrality at the right altitude | The artifact says nothing about implementation that the coding session is better placed to decide. Problem and Solution carry no implementation hints (no tools, vendors, schemas, libraries unless pre-existing constraints). Tech Design constrains architecture — boundaries, state ownership, seam contracts at kind level, invariants, failure posture — not code (no schemas, signatures, library choices). Testing asserts behaviour — Given/When/Then or invariants — not test code (no frameworks, harness specifics, file paths). Evidence: every sentence survives the altitude test relevant to the artifact's lens (Tech Design altitude test for Tech Design; Testing altitude test for Testing; for Problem and Solution, the test is "could a sentence here name a specific tool, vendor, schema, library, or framework?" — if yes, it's implementation drift). See `framework.md` § Altitude Discipline. |
| C14 | Title altitude | The artifact's title — and any Feature or Story titles it introduces — reads as a user-experience or business-outcome statement, not as a component, module, service, or technical-role name. A reader sees *what problem is being solved*, not *what part is being built*. "An open window stops heating the room" passes; "Resolver Service", "Schedule Reactor", "Config Writer" fail. A title naming a pre-existing external system ("Reconcile against ERP invoices") is not a component name — the line is the same as Solution S10: internal parts of the system being built. |
| C15 | Decision record integrity | Every decision in the artifact is numbered, and each one carries four things: its **basis** — `confirmed`, `partly inferred`, or `inferred` — the **evidence** it rests on, **what would falsify it**, and the **blast radius if it is wrong**. A decision recorded as a bare assertion, with no basis and no falsifier, fails however sound it reads. Decisions that have been reversed or replaced stay where they are, marked superseded, with their original reasoning intact — never deleted, never silently edited, so a reader can see what was believed and why it stopped being true. The basis field exists so a team can build on an unverified assumption *deliberately*, instead of either stalling until someone confirms it or building on it without knowing nobody ever did. Evidence: the auditor can pick any decision on the page and read off its basis, its evidence, its falsifier, and what breaks if it is wrong. See `framework.md` § Decision Records. |
| C16 | Reconciliation currency | The artifact states the decision it is currently reconciled to, and every decision taken since that carries a test-impact or scope-impact flag has either been addressed in this artifact or explicitly deferred with a reason. Evidence: the auditor can read the artifact's stated reconciliation point, list the flagged decisions taken after it, and find each one either reflected here or named as deferred. An artifact that is silent about what it is current as of fails — a reader cannot tell whether it is stale without reading every sibling artifact, which is exactly the cost this criterion exists to remove. |

**Note on C11 (v3.0.0).** C11 was *No duplication* through v1.x and v2.x — the right instinct stated too generically to bite. In v3.0.0 the slot keeps its concern and gains the law: the homes are named, so restatement is a Fail against a specific owner rather than a matter of taste. The same criterion, sharpened; not a reused slot.

**Note on C15 / C16 (v3.0.0).** A pair about the decision record rather than the prose. C15 governs each decision's integrity — is it labelled, falsifiable, and preserved when superseded. C16 governs the artifact's currency against the decisions around it — is it reconciled, and does it say to what. An artifact can pass C15 with a flawless decision log and still fail C16 by never reconciling against its siblings. Two distinct failure modes, two criteria.

## Assessment

The auditor assesses each criterion as **Pass**, **Partial**, or **Fail** with cited evidence from the artifact. The evidence requirement is what gives the rubric teeth — you can't hand-wave a Pass. Partials are accepted or rejected by the human directing the audit, not waved through.

## When to Use

The Core Rubric is used on **every artifact** at **every scale** — Epic, Feature, and Story. It is always applied alongside the relevant Discipline Rubric for the artifact type.

| Artifact | Core Rubric | Discipline Rubric |
|---|---|---|
| Problem | Core | Problem |
| Solution | Core | Solution |
| Tech Design | Core | Tech Design |
| Testing | Core | Testing |

At Story scale, assessment can be lighter — but the criteria still apply. A Story that ignores failure modes or hides trade-offs fails the same way an Epic does, just with smaller blast radius.
