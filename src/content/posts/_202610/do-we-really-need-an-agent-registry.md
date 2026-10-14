---
author: Derek Wang
pubDatetime: 2026-10-13T00:00:00-07:00
title: "Do We Really Need an Agent Registry?"
slug: do-we-really-need-an-agent-registry
featured: false
draft: false
tags:
  - AIAgent
  - Kynomesh
  - A2A
description: "Rethinking agent discovery with Kynomesh - why the platform that already knows your agents' topology doesn't need a separate registry."
canonicalURL: https://blog.kyno.sh/do-we-really-need-an-agent-registry-20bb251ee7ba
---

## The problem with dedicated agent registries

As AI agents move from isolated systems into distributed, collaborative networks, organizations face a familiar set of challenges: agent discoverability, reusability, trustworthiness, and manageability. The industry is investing heavily in dedicated agent registries and discovery infrastructure, including the A2A protocol's [Curated Registries](https://github.com/a2aproject/A2A/blob/main/docs/topics/agent-discovery.md) approach, [AI Catalog](https://ai-catalog.io/), [Agentic Resource Discovery (ARD)](https://github.com/ards-project/ard-spec), and cloud provider solutions.

That raises an architectural question:

> What if the agentic platform already knows which agents exist, what roles they play, and which agents need to communicate? Why should those agents need another system to discover one another?

Traditional registries make everything registered findable by every client that queries it, with visibility narrowed through filters and entitlements. Yet a dedicated registry introduces several complications:

- **Additional infrastructure overhead:** registries require operation, security monitoring, and maintenance.
- **Information duplication:** registry metadata must stay synchronized with actual agent deployments.
- **Increased client complexity:** agents need registry queries, endpoint resolution, caching, and error handling.
- **Redundant discovery policies:** registry visibility filters duplicate relationships already defined in the application architecture.
- **Unnecessary exposure:** broad discovery reveals agents that a specific workload doesn't need.

The fundamental issue remains: why introduce another discovery layer when the platform already has the information needed for discovery?

## Kynomesh: declare the system, derive discovery

[Kynomesh](https://github.com/kynoproj/kynomesh) takes a declarative approach with the **AgentSet** custom resource, which describes the cooperating agents and their communication pattern:

```yaml
apiVersion: kynomesh.kyno.sh/v1alpha1
kind: AgentSet
metadata:
  name: research-team
spec:
  pattern: Supervisor
  entry: coordinator
  agents:
    - name: coordinator
      container:
        image: example/coordinator:latest
    - name: researcher
      container:
        image: example/researcher:latest
    - name: analyst
      container:
        image: example/analyst:latest
```

This one declaration defines which agents exist, their roles, and how they communicate. Kynomesh controllers create the corresponding `AgentDeploy` resources and derive peer relationships from the declared topology. Each agent receives only its relevant peers through a generated `topology.json`.

With the Kynomesh SDK, an agent discovers its peers without Kubernetes API access or a separate registry:

```python
from kynomesh import client

async def discover_peers():
    discovered = []

    for name in client.peers():
        card = await client.resolve_agent_card(name)
        discovered.append({
            "name": name,
            "description": card.description,
            "skills": [skill.name for skill in card.skills],
        })

    return discovered
```

**The AgentSet is the natural registry.** It provides discovery without introducing another lookup service.

## Discovery should be distributed and need-to-know

Rather than organizing discovery around a catalog of everything available, Kynomesh makes discovery scope follow the declared communication topology. Different patterns produce different discovery behavior:

- **Supervisor:** the entry agent discovers its workers; workers don't automatically discover each other.
- **Sequential:** each agent discovers only its next peer.
- **Handoff:** participating agents can discover one another for flexible collaboration.

The result is a logically distributed discovery model where an agent only discovers the peers it needs. Scoping discovery this way reduces unnecessary exposure of agent information, and it complements - rather than replaces - authentication and authorization.

## Discovery and lifecycle belong together

Discovery is more than locating an endpoint. Agents are updated, scaled, and redeployed, and their capabilities change over time. Keeping a separate registry in sync with what is actually deployed is hard.

Kynomesh ties peer discovery to agent lifecycle management. For managed agents, Kubernetes Services provide stable endpoints that route to ready replicas. An optional `driftReload` mechanism detects relevant Agent Card changes and restarts the affected pods so cached peer information is refreshed.

External agents can participate through the declared topology too:

```yaml
externalAgents:
  - name: fraud-check
    url: https://fraud-check.example.com
```

When endpoints are already known and declared, no dedicated registry is required.

## When does a dedicated registry add value?

Registries remain valuable for open-ended capability search, agent marketplaces, enterprise-wide inventory, and cross-organization discovery - for example, searching for capabilities across organizations, browsing an enterprise-wide agent inventory, or dynamically selecting agents from independently managed providers.

Those scenarios are fundamentally different from discovering agents whose relationships are already declared as part of an application.

## Conclusion

Agent discovery is essential; a dedicated agent registry is not. Organizations should ask whether they genuinely have a discovery problem, or whether their platform has already solved it.

Kynomesh doesn't claim to replace every enterprise registry function. Instead, it turns the system's topology directly into discovery capabilities - without a separate registry, duplicated configuration, or additional registry-client logic.

## References

- [A2A Protocol - Agent Discovery](https://github.com/a2aproject/A2A/blob/main/docs/topics/agent-discovery.md)
- [A2A Agent Registry Community Discussion](https://github.com/a2aproject/A2A/discussions/741)
- [AI Catalog](https://ai-catalog.io/)
- [Agentic Resource Discovery (ARD) Specification](https://github.com/ards-project/ard-spec)
- [Kynomesh - GitHub Repository](https://github.com/kynoproj/kynomesh)
- [Kynomesh - Documentation](https://kyno.sh)
- [Kynomesh - Examples](https://github.com/kynoproj/kynomesh-examples)
