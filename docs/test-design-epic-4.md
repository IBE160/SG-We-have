# Test Design: Epic 4 - Interactive Quiz Experience

**Date:** tirsdag 18. november 2025
**Author:** BIP
**Status:** Draft / Approved

---

## Executive Summary

**Scope:** full test design for Epic 4

**Risk Summary:**

- Total risks identified: 14
- High-priority risks (≥6): 2
- Critical categories: BUS

**Coverage Summary:**

- P0 scenarios: 2 (4 hours)
- P1 scenarios: 6 (6 hours)
- P2 scenarios: 4 (2 hours)
- P3 scenarios: 3 (0.75 hours)
- **Total effort**: 12.75 hours (~1.6 days)

---

## Risk Assessment

### High-Priority Risks (Score ≥6)

| Risk ID | Category | Description                                         | Probability | Impact | Score | Mitigation                                 | Owner | Timeline |
| ------- | -------- | --------------------------------------------------- | ----------- | ------ | ----- | ------------------------------------------ | ----- | -------- |
| TD-R001 | BUS      | Navigation controls missing or non-functional, user stuck. | 2           | 3      | 6     | Implement robust navigation logic and E2E tests to verify functionality. | QA    | TBD      |
| TD-R002 | BUS      | Incorrect score displayed, user misled about performance.   | 2           | 3      | 6     | Implement server-side score calculation and E2E tests to verify accuracy. | QA    | TBD      |

### Medium-Priority Risks (Score 3-4)

| Risk ID | Category | Description                                         | Probability | Impact | Score | Mitigation   | Owner |
| ------- | -------- | --------------------------------------------------- | ----------- | ------ | ----- | ------------ | ----- |
| TD-R003 | BUS      | Quiz interface displays only one question at a time. | 2           | 2      | 4     | Monitor      | QA    |
| TD-R004 | BUS      | Question and its answer options are displayed clearly. | 2           | 2      | 4     | Monitor      | QA    |
| TD-R005 | BUS      | Correct option is highlighted green.                | 2           | 2      | 4     | Monitor      | QA    |
| TD-R006 | BUS      | Incorrect options are highlighted red.              | 2           | 2      | 4     | Monitor      | QA    |
| TD-R007 | BUS      | Clear feedback messages are displayed.              | 2           | 2      | 4     | Monitor      | QA    |
| TD-R008 | BUS      | Progress bar/counter accurately reflects user's progress. | 2           | 2      | 4     | Monitor      | QA    |
| TD-R009 | BUS      | Options to review answers.                          | 2           | 2      | 4     | Monitor      | QA    |
| TD-R010 | BUS      | Options to retake the quiz.                         | 2           | 2      | 4     | Monitor      | QA    |
| TD-R011 | BUS      | Buttons for "Retake same quiz" and "Generate new quiz" are available. | 2           | 2      | 4     | Monitor      | QA    |
| TD-R012 | BUS      | Clicking "Retake same quiz" starts a new quiz with identical questions. | 2           | 2      | 4     | Monitor      | QA    |
| TD-R013 | BUS      | Clicking "Generate new quiz" starts a new quiz with different questions. | 2           | 2      | 4     | Monitor      | QA    |
| TD-R014 | BUS      | Clicking "Want to learn more?" reveals 1-3 factual sentences. | 2           | 2      | 4     | Monitor      | QA    |

### Low-Priority Risks (Score 1-2)

| Risk ID | Category | Description   | Probability | Impact | Score | Action  |
| ------- | -------- | ------------- | ----------- | ------ | ----- | ------- |
| R-005   | OPS      | {description} | 1           | 2      | 2     | Monitor |
| R-006   | BUS      | {description} | 1           | 1      | 1     | Monitor |

### Risk Category Legend

- **TECH**: Technical/Architecture (flaws, integration, scalability)
- **SEC**: Security (access controls, auth, data exposure)
- **PERF**: Performance (SLA violations, degradation, resource limits)
- **DATA**: Data Integrity (loss, corruption, inconsistency)
- **BUS**: Business Impact (UX harm, logic errors, revenue)
- **OPS**: Operations (deployment, config, monitoring)

---

## Test Coverage Plan

### P0 (Critical) - Run on every commit

**Criteria**: Blocks core journey + High risk (≥6) + No workaround

| Requirement   | Test Level | Risk Link | Test Count | Owner | Notes   |
| ------------- | ---------- | --------- | ---------- | ----- | ------- |
| {requirement} | E2E        | R-001     | 3          | QA    | {notes} |
| {requirement} | API        | R-002     | 5          | QA    | {notes} |

**Total P0**: {p0_count} tests, {p0_hours} hours

### P1 (High) - Run on PR to main

**Criteria**: Important features + Medium risk (3-4) + Common workflows

| Requirement   | Test Level | Risk Link | Test Count | Owner | Notes   |
| ------------- | ---------- | --------- | ---------- | ----- | ------- |
| {requirement} | API        | R-003     | 4          | QA    | {notes} |
| {requirement} | Component  | -         | 6          | DEV   | {notes} |

**Total P1**: {p1_count} tests, {p1_hours} hours

### P2 (Medium) - Run nightly/weekly

**Criteria**: Secondary features + Low risk (1-2) + Edge cases

| Requirement   | Test Level | Risk Link | Test Count | Owner | Notes   |
| ------------- | ---------- | --------- | ---------- | ----- | ------- |
| {requirement} | API        | R-004     | 8          | QA    | {notes} |
| {requirement} | Unit       | -         | 15         | DEV   | {notes} |

**Total P2**: {p2_count} tests, {p2_hours} hours

### P3 (Low) - Run on-demand

**Criteria**: Nice-to-have + Exploratory + Performance benchmarks

| Requirement   | Test Level | Test Count | Owner | Notes   |
| ------------- | ---------- | ---------- | ----- | ------- |
| {requirement} | E2E        | 2          | QA    | {notes} |
| {requirement} | Unit       | 8          | DEV   | {notes} |

**Total P3**: {p3_count} tests, {p3_hours} hours

---

## Execution Order

### Smoke Tests (<5 min)

**Purpose**: Fast feedback, catch build-breaking issues

- [ ] {scenario} (30s)
- [ ] {scenario} (45s)
- [ ] {scenario} (1min)

**Total**: {smoke_count} scenarios

### P0 Tests (<10 min)

**Purpose**: Critical path validation

- [ ] {scenario} (E2E)
- [ ] {scenario} (API)
- [ ] {scenario} (API)

**Total**: {p0_count} scenarios

### P1 Tests (<30 min)

**Purpose**: Important feature coverage

- [ ] {scenario} (API)
- [ ] {scenario} (Component)

**Total**: {p1_count} scenarios

### P2/P3 Tests (<60 min)

**Purpose**: Full regression coverage

- [ ] {scenario} (Unit)
- [ ] {scenario} (API)

**Total**: {p2p3_count} scenarios

---

## Resource Estimates

### Test Development Effort

| Priority  | Count             | Hours/Test | Total Hours       | Notes                   |
| --------- | ----------------- | ---------- | ----------------- | ----------------------- |
| P0        | {p0_count}        | 2.0        | {p0_hours}        | Complex setup, security |
| P1        | {p1_count}        | 1.0        | {p1_hours}        | Standard coverage       |
| P2        | {p2_count}        | 0.5        | {p2_hours}        | Simple scenarios        |
| P3        | {p3_count}        | 0.25       | {p3_hours}        | Exploratory             |
| **Total** | **{total_count}** | **-**      | **{total_hours}** | **~{total_days} days**  |

### Prerequisites

**Test Data:**

- {factory_name} factory (faker-based, auto-cleanup)
- {fixture_name} fixture (setup/teardown)

**Tooling:**

- {tool} for {purpose}
- {tool} for {purpose}

**Environment:**

- {env_requirement}
- {env_requirement}

---

## Quality Gate Criteria

### Pass/Fail Thresholds

- **P0 pass rate**: 100% (no exceptions)
- **P1 pass rate**: ≥95% (waivers required for failures)
- **P2/P3 pass rate**: ≥90% (informational)
- **High-risk mitigations**: 100% complete or approved waivers

### Coverage Targets

- **Critical paths**: ≥80%
- **Security scenarios**: 100%
- **Business logic**: ≥70%
- **Edge cases**: ≥50%

### Non-Negotiable Requirements

- [ ] All P0 tests pass
- [ ] No high-risk (≥6) items unmitigated
- [ ] Security tests (SEC category) pass 100%
- [ ] Performance targets met (PERF category)

---

## Mitigation Plans

### R-001: {Risk Description} (Score: 6)

**Mitigation Strategy:** {detailed_mitigation}
**Owner:** {owner}
**Timeline:** {date}
**Status:** Planned / In Progress / Complete
**Verification:** {how_to_verify}

### R-002: {Risk Description} (Score: 6)

**Mitigation Strategy:** {detailed_mitigation}
**Owner:** {owner}
**Timeline:** {date}
**Status:** Planned / In Progress / Complete
**Verification:** {how_to_verify}

---

## Assumptions and Dependencies

### Assumptions

1. {assumption}
2. {assumption}
3. {assumption}

### Dependencies

1. {dependency} - Required by {date}
2. {dependency} - Required by {date}

### Risks to Plan

- **Risk**: {risk_to_plan}
  - **Impact**: {impact}
  - **Contingency**: {contingency}

---

## Approval

**Test Design Approved By:**

- [ ] Product Manager: **\*\***\_\_\_**\*\*** Date: **\*\***\_\_\_**\*\***
- [ ] Tech Lead: **\*\***\_\_\_**\*\*** Date: **\*\***\_\_\_**\*\***
- [ ] QA Lead: **\*\***\_\_\_**\*\*** Date: **\*\***\_\_\_**\*\***

**Comments:**

---

---

---

## Appendix

### Knowledge Base References

- `risk-governance.md` - Risk classification framework
- `probability-impact.md` - Risk scoring methodology
- `test-levels-framework.md` - Test level selection
- `test-priorities-matrix.md` - P0-P3 prioritization

### Related Documents

- PRD: {prd_link}
- Epic: {arch_link}
- Architecture: {arch_link}
- Tech Spec: {tech_spec_link}

---

**Generated by**: BMad TEA Agent - Test Architect Module
**Workflow**: `.bmad/bmm/testarch/test-design`
**Version**: 4.0 (BMad v6)
