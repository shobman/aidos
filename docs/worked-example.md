# Worked Example: Deployment Notifications

*A Feature-scale walkthrough showing the human–AI workflow, not just the finished artifacts.*

> **For Epic-scale multi-agent flows** — where parallel sub-agents fill out per-Story artifacts across a larger initiative — see `/aidos-breakdown` and `/aidos-fanout` (introduced in v1.4.0).

---

This example follows a platform engineer and an AI builder through a realistic delivery session. It shows the interaction pattern: how problems get framed, where assumptions surface, what happens when the auditor finds gaps, and how decisions get escalated when they can't be resolved in the session.

The scenario is Feature scale — one combined document (Problem + Solution + Tech Design) and a separate Test Plan. The tone is deliberately imperfect. People change their minds. The builder captures something in the wrong place and corrects. The auditor raises a finding that turns out to be an Idea, not a Bug. That's the framework working as designed.

---

## Setup

The human opens a builder session.

> **Human:** We need to add deployment notifications to our CI/CD pipeline. When a deploy succeeds or fails, the right people should know — in the right channel, with enough context to act. Right now nobody finds out about a failed deploy until someone notices the service is broken.

The builder recognises this as a Feature — it's a specific deliverable, likely one to two sprints, with a clear scope boundary. It scaffolds a combined document (Problem + Solution + Tech Design) and a separate Test Plan.

> **Builder:** This looks like Feature scale. I'll set up a combined document and a separate Test Plan. Before we start — is this part of a larger Epic, or is it standalone?

> **Human:** Standalone. There's no parent Epic. The platform team has been talking about this for months but nobody's written anything down.

> **Builder:** Then we'll need our own Overflow Log for anything that surfaces but doesn't belong in the current scope. Let me scaffold that too.

---

## Problem

> **Builder:** Let's start with the Problem. Who's experiencing this, and what's it actually costing?

> **Human:** It's all product teams — about twelve teams deploying through our shared pipeline. When a deploy fails, nobody gets notified. The person who triggered it might notice if they're watching the pipeline dashboard, but most people fire and forget. Failed deploys sit unnoticed for hours. Last month we had a payment service deploy fail at 2am and nobody caught it until users started reporting errors at 9am.

> **Builder:** I'll capture that — the payment service incident is good evidence for the Impact section. Who are the stakeholders here?

> **Human:** Platform team owns the pipeline. Product teams are the users. On-call engineers need to know about failures in their services. And our head of engineering has been asking for visibility into deploy health.

> **Builder:** Got it. For success criteria — what does "the right people know" look like in practice? Is there a time target?

> **Human:** Teams should know about a failed deploy within five minutes. Success should be notified too, but that's lower priority — nobody's losing sleep over missing a success notification.

The builder drafts the Problem section. While structuring the Assumptions, it surfaces something:

> **Builder:** I'm writing up assumptions. One I want to flag: I'm assuming all twelve teams receive notifications in the same way — same channel type, same message format. Is that true? Because some teams might use Slack and others might use Teams, or some might want a webhook into their own monitoring.

> **Human:** Good catch. Actually, that's not true at all. Most teams use Slack but two teams are on Teams, and the SRE team wants notifications piped into PagerDuty for failures.

> **Builder:** That changes the shape of this. We're not building a "send a Slack message" feature — we're building a notification routing system. I'll update the Problem to reflect that. And I want to raise an issue: who owns the routing rules? If team A changes their notification channel, who updates the config?

> **Human:** That's a good question. I don't know the answer. The platform team would probably say it's the product teams' responsibility, but the product teams will say they don't have access to pipeline config.

> **Builder:** I'll raise this as SOCIALISE — it needs discussion before we can resolve it. It'll shape the Solution.

The builder captures issue I1:

> **I1: Notification routing ownership.** Who is responsible for configuring and maintaining each team's notification channels and rules? Platform team does not currently delegate pipeline config access to product teams. Status: SOCIALISE.

The builder completes the Problem section with goals, non-goals, constraints, and existing alternatives. One non-goal worth noting:

> **Non-goals:** Deployment metrics and analytics. During this session the human mentioned wanting a dashboard showing deploy frequency and success rates — the builder parked this in the Overflow Log as O1 (PARKED, probable destination: a future Feature) rather than letting it expand the current scope.

---

## Solution

> **Builder:** Moving to the Solution. The core problem is: get the right notification to the right people in the right channel within five minutes of a deploy event. Three approaches I can see:
>
> **Option A — Webhook-based.** Pipeline emits a webhook on deploy events. A notification service receives it, looks up routing config, formats the message, and sends it to the appropriate channel (Slack, Teams, PagerDuty). Simple, direct, easy to reason about.
>
> **Option B — Event bus.** Pipeline publishes deploy events to a message queue. Consumers subscribe and handle their own notifications. More flexible, more infrastructure.
>
> **Option C — Polling.** A service polls the pipeline API for deploy status changes. No pipeline changes needed, but introduces latency and coupling.

> **Human:** Option A feels right. We don't need the flexibility of an event bus for this, and polling is fragile. Let's go with the webhook approach.

> **Builder:** Agreed. I'll document Options B and C as considered-and-rejected with rationale.

The builder works through the Solution: notification service receives webhooks, looks up team routing config, formats messages per channel type, delivers. During the workflow mapping:

> **Builder:** I need to think about the message format. A failed deploy and a successful deploy probably carry different information. Failures need: what failed, which service, which commit, who triggered it, and a link to the pipeline log. Success might just need: service name, environment, version deployed. Does that match what you'd want?

> **Human:** Yes, but add rollback status to failures too — did the pipeline auto-rollback, or is the failed version still running?

> **Builder:** Good. I also want to flag a dependency risk. We'll be calling the Slack API, the Teams API, and the PagerDuty API. Slack and PagerDuty have well-documented APIs with retry support. But Teams — specifically the incoming webhook connector — has no documented retry guarantee and I've seen reliability issues with it in other projects. I'll raise this as a Risk.

The builder captures issue I2:

> **I2: Teams webhook reliability.** The Microsoft Teams incoming webhook connector has no documented retry guarantee and has known reliability issues. Two teams depend on Teams notifications. Status: OPEN. Classification: Risk.

The builder also notices the human mentioned "auto-rollback" — which implies the pipeline has rollback behaviour that the notification service needs to know about. This wasn't in the Problem. Rather than expanding scope, the builder captures it:

> **Builder:** You mentioned auto-rollback. Does the pipeline already do this? The notification service needs to know the rollback outcome to include it in the failure message, but the rollback mechanism itself is out of our scope. I'll add an assumption that the pipeline exposes rollback status in its webhook payload.

> **Human:** Yes, the pipeline already does auto-rollback on health check failure. And yes, the status is in the webhook payload.

---

## Tech Design

The builder moves into Tech Design within the same combined document.

> **Builder:** The notification system has three architectural boundaries. Let me walk through them at the right altitude:
>
> 1. **Webhook receiver boundary** — owns: accepting deploy event payloads from the pipeline, acknowledging receipt fast. Does NOT own: routing, formatting, or delivery. Trust direction: pipeline initiates; receiver is authoritative for "we got it".
> 2. **Routing boundary** — owns: per-team channel selection given a deploy event. Source of truth for routing config is the service repo (single writer: PR-merged config). Does NOT own: message content.
> 3. **Channel delivery boundary** — owns: getting the formatted message to the named channel. Does NOT own: deciding what to send or when. Each channel target (Slack / Teams / PagerDuty) is a distinct seam.

> **Human:** Wait — the routing config stored in the service repo means product teams need to submit PRs. That's friction.

> **Builder:** It's a deliberate constraint — routing config has one writer at architectural level. The alternative (self-service UI / config service) would split ownership and is significant added scope. For now, PR-based routing is the architectural choice; the implementer chooses HOW to load and validate the config. I'll add this to A9 Left Open: "the coding session chooses config loading and validation approach, including hot-reload if desired."

The builder works through invariants and failure posture:

> **Builder:** Invariants worth pinning:
> - **Always-true:** every deploy event reaching the receiver produces exactly one routing decision (idempotent receiver — duplicate webhooks don't multi-notify).
> - **Sacred:** failure notifications are never silently dropped. If a channel delivery fails after retries, the event goes to a dead letter queue for manual recovery — not lost.
> - **Decision-precedence:** none needed; routing config is the single decision input.
>
> For failure posture: the receiver tolerates pipeline duplicate-webhook bursts (idempotency invariant). The Teams channel has known reliability concerns (I2) — the failure-posture decision is to surface via DLQ rather than retry indefinitely. The Slack and PagerDuty channels heal via standard retry; their failure surfaces operator-visible only after sustained failure.

> **Human:** What about the burst-deploy scenario — twelve teams deploying together?

> **Builder:** Quality property: must handle 20 events within a 5-minute window without dropping. Architectural implication: receiver queues internally before processing — synchronous receive-and-deliver wouldn't survive the burst. The temporal stance for the receiver-to-delivery flow is **asynchronous** — receipt and delivery are decoupled by an in-memory queue. The implementer chooses the queue mechanism, but the architecture mandates the decoupling.

The builder captures the Implementation Handoff:

> **Builder:** For the handoff:
> - **Constrained:** webhook receiver must acknowledge within 200ms; routing config is the single source of truth for per-team channels; failure DLQ is mandatory for Teams; receiver-to-delivery is asynchronous.
> - **Left open:** queue mechanism (in-memory, Redis, SQS — coding session's call); message format per channel (Block Kit / Adaptive Card / PagerDuty event — implementer chooses the framing approach); config validation strategy.
> - **Locked-in vs reversible:** the routing-config schema is locked-in (product teams will write it); the queue mechanism is reversible (no external surface).
>
> Trust zones: the receiver runs in the same trust zone as the pipeline (internal network). The delivery boundary crosses out to third-party APIs (Slack / Teams / PagerDuty) — that's a trust transition; secrets management for those APIs is constrained but the implementer chooses how (env vars, secret store, etc.). Transition strategy: greenfield, no existing notification service to migrate from.

---

## Handoff to Audit

The builder completes the combined document and Test Plan. Status moves to REVIEW.

> **Builder:** The combined document (Problem + Solution + Tech Design) and the Test Plan are ready for audit. Summary of open items:
>
> - **I1** (SOCIALISE): Notification routing ownership — needs discussion with platform and product teams
> - **I2** (OPEN/Risk): Teams webhook reliability — decision needed on whether to accept the risk
> - **O1** (PARKED): Deploy metrics dashboard — future scope
> - **O2** (PARKED): Self-service notification config UI — future scope

---

## Audit — Pass 1

A different person runs the audit with AI assistance. The auditor loads the combined document and applies Core + Problem + Solution + Tech Design rubrics.

> **Auditor:** Running Pass 1 against the combined document. Starting with Problem, then Solution, then Tech Design, then coherence checks across the stack.

The Problem section clears cleanly — well-scoped, measurable goals, clear stakeholders, assumptions surfaced. The auditor notes one finding in the Solution:

> | Criterion | Assessment | Evidence | Classification |
> |---|---|---|---|
> | S6: Dependency identification | Partial | Teams webhook reliability is flagged as a risk (I2), but the Slack API dependency is assumed reliable without evidence. Slack API has rate limits — at 12 teams × multiple channels, are we within limits? | Bug |

On Pass 1, the auditor flagged the Tech Design against the Problem:

| Criterion | Assessment | Evidence | Classification |
|---|---|---|---|
| A4: Invariants | Partial | Sacred-operation invariant ("failure notifications never silently dropped") is stated, but the receiver-to-delivery flow's idempotency invariant is only implied. With 12 teams deploying through a shared pipeline that may retry on its end, duplicate webhooks for the same deploy are realistic — pin the idempotency invariant explicitly so the implementation knows it has to dedupe. | Risk |

The builder addressed it by adding the idempotency invariant explicitly to A4 ("duplicate webhook delivery for the same deploy event produces exactly one routing decision") and noting in A9 Constrained that the receiver must dedupe on a stable event ID. Pass 2 cleared.

Moving to Tech Design (remaining criteria):

> | Criterion | Assessment | Evidence | Classification |
> |---|---|---|---|
> | A6: Failure and recovery posture | Partial | The document specifies monitoring (health endpoint, delivery latency metric) but does not identify who is on the hook when the notification service itself fails. If notifications silently fail — e.g., the service is down during a deploy — who gets paged? The "operator-required" leg of the failure posture is unstated. | Bug |

The auditor also raises two non-Bug findings:

> | Criterion | Assessment | Evidence | Classification |
> |---|---|---|---|
> | A5: Quality properties | Pass | Throughput assumption documented (20 events per 5-minute window). In-memory queue justified for current scale. | — |
> | C6: Observability | Pass (with Idea) | Observability is addressed, but consider adding a metric for notification *delivery confirmation* — did the recipient channel actually accept the message? This would catch silent failures at the channel API level, not just at the HTTP level. | Idea |

Finally, the coherence check:

> **Auditor:** Coherence check — Tech Design against Problem. The Problem states teams should know about a failed deploy within five minutes. The Tech Design specifies a queue-based architecture, but doesn't address what happens if the notification service itself is down when a deploy event fires. The webhook would fail, the event is lost, and nobody gets notified. The five-minute goal has no mechanism for this scenario.

This is classified as a Bug — a gap in the coherence chain.

**Pass 1 summary:** 2 Bugs, 1 Risk (A4 — addressed inline above), 1 Idea. Sent back to builder.

---

## Builder Fixes

The builder addresses the findings:

> **Builder:** Working through the audit findings.
>
> **S6 (Rate limits):** Adding a rate limit section. Slack rate limit is 1 message per second per webhook URL. Each team has its own webhook URL, so twelve teams can send in parallel. The risk is if multiple teams share an alerts channel — but the routing config maps teams to their own channels, not shared ones. I'll add this as a stated constraint: each team must have its own notification channel. If teams want to share a channel, the routing config needs rate-limiting logic. For now, one-team-one-channel keeps us within limits.
>
> **A6 (Operator-required failure path):** The platform team owns the notification service. On-call rotation for the platform team is paged if the health endpoint fails. Adding this explicitly to the Failure and Recovery section as the operator-required posture.
>
> **Coherence gap (notification service down):** Adding a resilience mechanism. The pipeline webhook delivery should use at-least-once delivery — if the notification service returns a non-200, the pipeline retries three times over five minutes. If still failing, the pipeline logs a warning to its own monitoring, which the platform team already watches. This closes the gap: if the notification service is down, the pipeline's own monitoring surfaces it.

The human also makes a decision on the Risk:

> **Human:** For I2 (Teams webhook reliability) — let's accept the risk and use the dead letter queue. If Teams notifications are unreliable, the DLQ captures what was lost and we can manually forward them. Update the issue to a decision.

> **Builder:** Moving I2 to Decisions. The DLQ is already in the Tech Design.

The Idea (delivery confirmation metric) is noted in the Overflow Log as O3 (PARKED, probable destination: operational improvement after initial deployment).

---

## Audit — Pass 2

The auditor re-assesses only the criteria that were Partial or Fail in Pass 1.

> | Criterion | Pass 2 Assessment | Evidence |
> |---|---|---|
> | S6: Dependency identification | Pass | Rate limits addressed. One-team-one-channel constraint stated. Slack, Teams, and PagerDuty dependencies documented with their limitations. |
> | A4: Invariants | Pass | Idempotency invariant pinned explicitly. Covered in Pass 1 finding above. |
> | A6: Failure and recovery posture | Pass | Platform team named as owner for the operator-required failure path. On-call paging specified for health endpoint failure. |
> | Coherence (Problem → Tech Design) | Pass | Pipeline retry + pipeline monitoring closes the five-minute notification gap for the service-down scenario. |

**Pass 2: All clear.** Artifact status moves to ACCEPTED.

---

## Escalated Decision

After the audit passes, I1 still needs resolution. It moved from SOCIALISE to ESCALATE during a team discussion where no consensus was reached.

> **I1 → ESCALATE: Notification routing ownership.**
>
> **Options:**
> (A) Platform team owns all routing config. Product teams submit requests to change their channels.
> (B) Product teams own their own routing config via PRs to the service repo. Platform team reviews and merges.
> (C) Shared ownership — platform team owns the routing infrastructure, product teams own their channel mappings within a self-service config structure.
>
> **Recommendation:** Option B. Product teams know their own channels and preferences. PR-based config gives the platform team a review gate without creating a bottleneck. This also creates a natural path toward the self-service UI (O2) if PRs become painful.
>
> **Downstream impact:** If Option A, the platform team becomes a bottleneck for every channel change. If Option C, we need the self-service config structure now rather than later, which expands scope.
>
> **Who decides:** Head of Engineering.

The Head of Engineering chose Option B. Issue moved to the Decisions table:

> | # | Source | Issue | Resolution | Decided By | Date |
> |---|---|---|---|---|---|
> | D1 | I1 | Notification routing ownership | Option B — product teams own routing config via PRs, platform team reviews. | Head of Engineering | 2026-03-21 |

---

## Test Plan

The builder creates the Test Plan as a separate document, tracing tests to Solution goals.

| # | Traces To | Given | When | Then (expected behaviour) |
|---|---|---|---|---|
| BA1 | G1 (failure notification within 5 min) | A team is configured with a notification channel | A deploy for that team fails | The team's channel receives a failure notification within 5 minutes |
| BA2 | G1 (failure notification — Teams reliability) | A team uses Teams as their channel | A Teams delivery fails after retries | The event lands in the DLQ within 30 seconds; no silent drop |
| BA3 | G2 (success notification) | A team is configured with a notification channel | A deploy for that team succeeds | The team's channel receives a success notification |
| BA4 | Constraint (burst deploys) | 12 teams deploying in a coordinated window | 20 deploy events fire within 5 minutes | All teams receive their notifications; no events lost; receiver remains responsive |
| BA5 | Resilience (service down) | The notification service is offline | A deploy fires during the outage; service comes back online | The pipeline's retry mechanism delivers the event; the team's channel receives notification after service recovery; pipeline monitoring surfaces the outage |
| BA6 | Routing (multi-channel) | Team A configured for Slack and Team B configured for PagerDuty | Deploys fire for both teams | Each team receives notification in their configured channel only — no cross-delivery |
| BA-I1 | Invariant: idempotency | The receiver accepts a deploy event | The same event is delivered again (pipeline retry) | Exactly one routing decision is made; the team receives at most one notification |

The auditor runs the Testing rubric against the Test Plan and clears it on Pass 1 — traceability is strong, scenarios cover happy path, edge cases, and failure modes, and exit criteria are specific.

---

## What This Example Showed

**The audit caught real gaps.** The builder — working closely with the human, thinking carefully about the design — still missed rate limits, operational ownership, and a coherence gap where the notification service being down broke the five-minute goal. The auditor, applying the rubrics independently, found all three. That's not a failure of the builder. That's the framework working as designed.

**The coherence check caught a traceability miss.** The Problem said "within five minutes." The Tech Design addressed the happy path but not the failure path. The coherence check — verifying that the Tech Design actually implements the Solution which actually solves the Problem — is what caught it. Rubric criteria found the component-level issues; the coherence chain found the end-to-end gap.

**The overflow mechanism captured future work without derailing the session.** Deploy metrics (O1), self-service config UI (O2), and delivery confirmation metrics (O3) all surfaced naturally during the session. Each was parked with a probable destination rather than expanding scope or being forgotten.

**The escalation process got a decision documented.** Notification routing ownership (I1) moved through SOCIALISE → ESCALATE → Decision with a full decision packet. The Head of Engineering made an informed choice without reading the full artifact — the decision packet gave them the options, the recommendation, and the downstream impact.

**The builder surfaced an assumption the human hadn't considered.** The human assumed all teams use the same notification channel. The builder caught it. That assumption, if it had survived into the Tech Design, would have produced a system that only worked for Slack teams — and the Teams and PagerDuty users would have discovered this after delivery.

