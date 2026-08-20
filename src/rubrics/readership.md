# Readership Rubric

The second audit pass. The rubric pass asks whether the artifact is **sound**; this one asks whether it can **survive being read** by the people who must act on it. Two passes, two verdicts, never conflated — an artifact can pass the first cleanly and still fail the second.

That is not hypothetical, and it is the reason this rubric exists. A Solution passed two clean auditor passes; four days later, nobody at sprint planning had read it. The rubric measured whether the artifact was sound. Nothing measured whether it could be read. Soundness that never reaches a reader changes nothing — an unread artifact is indistinguishable from an absent one.

This rubric is deliberately small and cheap to run. It adds four questions, not a second full review.

---

## Criteria

| # | Criterion | What "Pass" Looks Like |
|---|---|---|
| R1 | Readable in one sitting at its altitude | The artifact's length is proportionate to its scale and to what its audience actually needs from it. A section that has outgrown its host is split out into its own artifact — not padded to look deliberate, not left to keep growing. Evidence: the auditor can state roughly how long the artifact takes to read and say why that is the right length for the people who must read it. "It is thorough" is not an answer; length has to be justified against a reader, not against the subject. |
| R2 | Owns only what it owns | Nothing in this artifact restates content another artifact owns. This is Core C11 seen from the reader's side rather than the record's: restatement makes the artifact longer, makes the reader's job harder, and guarantees the two copies diverge the first time one of them is updated. A reader who has already read the owning artifact should find nothing here they have read before — only pointers to it. |
| R3 | Movement is visible | A returning reader can see what changed and when without diffing the file. Recent changes are surfaced where a reader will actually find them — at the top, or wherever the artifact's structure puts the eye first — and superseded content stays legible in place rather than quietly disappearing. A change buried as a subheading eighty percent down the page fails: it is technically recorded and practically invisible. |
| R4 | Walk-through evidence | Someone other than the author has explained the artifact back in their own words, and what changed as a result is recorded. This is a human act. The auditor cannot perform it and cannot judge it by reading the document — it checks only for **evidence of** it: who walked it through, when, and what the artifact gained or lost because of it. It is the one criterion an AI cannot assess from the text, and it is the criterion that catches what the other three cannot — the artifact that is short, well-owned, and clearly versioned, and still means nothing to the people expected to build from it. Absence of evidence is a Fail, not a Partial: the walk-through either happened or it did not. |

**Note on R2.** R2 and Core C11 are the same law read from two directions. C11 asks whether the *record* is correct — does each fact have exactly one home. R2 asks whether the *reader* is being made to pay for a violation. An artifact almost never fails one without failing the other; when it does, cite both.

**Note on R4 (v3.0.0).** AIDOS is honest about this: three of the four criteria here are things an AI auditor judges well, and the fourth is not one of them. R4 is kept anyway, and kept in the rubric rather than in guidance, because the failure it catches is the one that motivated the whole pass. Judging it is a matter of checking a record, not of reading prose.

## Assessment

The auditor assesses each criterion as **Pass**, **Partial**, or **Fail** with cited evidence from the artifact.

- **Pass** — the criterion is fully met with clear evidence.
- **Partial** — the criterion is partly met or the evidence is weak. The human directing the audit decides whether to accept or send back.
- **Fail** — the criterion is not met. This is classified as a Bug and must be fixed before the artifact advances.

The readership pass carries its own verdict, reported separately from the rubric pass. It is never averaged into it, and a clean rubric pass never excuses a readership Fail — the two passes answer different questions and a reader only ever experiences the second one.

## When to Use

Run the readership pass on **every artifact**, at **every scale**, after the rubric pass has completed. The order matters: a document that is unsound is not worth measuring for readability, and fixing soundness usually changes length and structure anyway.

| Pass | Rubrics applied | Question answered |
|---|---|---|
| First | Core + the relevant Discipline Rubric | Is this artifact sound? |
| Second | Readership | Can it survive contact with the people who must act on it? |

At Story scale the pass is quick — R1 and R3 are usually self-evident and R4 often points at a conversation the team had rather than a formal walk-through. Record it anyway. The criterion is evidence of the conversation, not ceremony around it.

See `framework.md` § Builder / Auditor Separation for why the audit is a separate act from authorship, and `framework.md` § Artifact Authority for the ownership rule R2 reads from the reader's side.
