## Scope
- GraphQL acts as a BFF over existing RPCs
- All interactions are **queries/mutation only**
- CTAs and navigation are handled entirely on FE

# Dashboard – GraphQL Schema

Query
```
type Query {
  dashboard(userId: ID!): Dashboard
}
```

## **Dashboard Root**
```
type Dashboard {
  roleplayDiscovery: RoleplayDiscovery
  skillHealth: SkillHealth

  TBD_layoutConfig: DashboardLayoutConfig
}
```
**RPC**
- None
- Orchestrates multiple downstream RPCs

## **Roleplay Discovery**
Used for:
- Hero Roleplay
- Roleplay Templates
- Ranked Roleplays

```
type RoleplayDiscovery {
  hero: RoleplayCard
  templates: [RoleplayCard!]!
  ranked: [RoleplayCard!]!
}
```
### **Backing RPC**
**PncRoleplayDashboardService**
- GetRankedRoleplays
##### **Category Mapping**
| **GQL Field** | **RPC RoleplayCategory**       |
| ------------- | ------------------------------ |
| hero          | ROLEPLAY_CATEGORY_HERO         |
| templates     | ROLEPLAY_CATEGORY_TEMPLATE     |
| suggested     | ROLEPLAY_CATEGORY_PERSONALISED |
RPC Output Used:
```
RankedRoleplay {
  roleplay_id
  rank
}
```


## **Roleplay Card (Composed View Model)**

```
type RoleplayCard {
  id: ID!
  title: String!
  description: String
  durationMinutes: Int
  skills: [Skill!]!
  persona: PersonaCard
  thumbnailUrl: String
  lastPracticedOn: DateTime
  trend: String
  gapInfo: String
}


Field Ownership
- Roleplay data → Roleplay Dashboard Service
- Persona → Persona Service
- Thumbnail → Content Service

- Gap info → Personalised roleplays only

```
This object is **composed from multiple services**.
### **RoleplayCard Field → RPC Mapping**
  #### **id**
- **RPC**: GetRankedRoleplays
- **Field**: ranked_roleplays.roleplay_id
- **Notes**: Primary join key for all downstream calls
##### **title**
- **RPC**: GetRoleplayCardDetailsForUser
- **Field**: RoleplayCardDetails.title
##### **description**
- **RPC**: GetRoleplayCardDetailsForUser
- **Field**: RoleplayCardDetails.description
##### **durationMinutes**
- **RPC**: GetRoleplayCardDetailsForUser
- **Field**: recommended_time_limit_in_minutes
##### **lastPracticedOn**
- **RPC**: GetRoleplayCardDetailsForUser
- **Field**: last_practiced_at
##### **skills**
```
type Skill {
  id: ID!
  name: String!
}
```
- **RPC (indirect)**: GetRoleplayDetailsForNewAttempt
- **Field**: competency_tag_ids
- **Additional service**: Competency metadata service
Resolution Flow:
```
roleplay_id
 → competency_tag_ids
 → competency service
 → Skill { id, name }
```


## **Persona Card**

```
type PersonaCard {
  id: ID!
  name: String
  roleName: String
  title: String
  companyName: String
  avatarUrl: String
}
```
**Persona ID source**
- **RPC**: GetRoleplayCardDetailsForUser
- **Field**: persona_id

**Persona details**
- **Service**: Persona Service
- **Fields**:
    - name
    - roleName
    - title
    - companyName
    - avatar reference

#### **thumbnailUrl**
- **Service**: Content Service
- **Input**:
    - Persona avatar reference or roleplay media reference

#### **gapInfo**
- **RPC**: GetRoleplayCardDetailsForUser
- **Field**: reasoning
- **Availability**:
    - Only for ROLEPLAY_CATEGORY_PERSONALISED
    - Empty for templates / hero templates

#### **trend** ( TBD )
- **Source**: Derived / Computed
- **Example**: "17 reps practiced this week"
- **Notes**:
    - Not available in any current RPC

## **Skill Health Section (Insights)**

```
type SkillHealthSection {
  title: String!
  subtitle: String!
  chart: BarChartDataset
}

Defaults (resolved in GQL):
- title = “Skill Health”
- subtitle = “Based on last 30 days performance”

```
### **Backing RPC**
**PncRoleplayStatsService**
- GetAggregatedInsights

**RPC Input**
time_filter = LAST_30_DAYS

## **Generic Bar Chart Contract**

```
type BarChartDataset {
  dataset: [BarChartCategory!]!
}

type BarChartCategory {
  category: ChartCategory!
  fields: [ChartField!]!
}

type ChartCategory {
  name: String!
  redirectionId: ID!
}

type ChartField {
  name: String!
  label: String!
  value: Float!
}


Skill Health Semantics
- Category: Skill / Competency
- Fields:
    - YOU → Learner score
    - TOP_REPS → Benchmark score
```
### **Skill Health Semantics**
**Category**
- name → Competency name
- redirectionId → competency_tag_id

**Fields (Bars per skill)**

| **Field name** | **Source**                                              |
| -------------- | ------------------------------------------------------- |
| YOU            | AggregatedCompetencyScores.average_score                |
| TOP_REPS       | AggregatedCompetencyScores.average_score_top_20_percent |

Mapped from RPC:
```
AggregatedCompetencyScores {
  competency_tag_id
  average_score
  average_score_top_20_percent
}
```

#### **Supporting Scaler**
```
scalar DateTime
```

## **RPC Summary (Quick Reference)**

| **GQL Area**       | **RPC / Service**                                    |
| ------------------ | ---------------------------------------------------- |
| Roleplay discovery | GetRankedRoleplays                                   |
| Card metadata      | GetRoleplayCardDetailsForUser                        |
| Skills             | GetRoleplayDetailsForNewAttempt + competency service |
| Persona            | Persona Service                                      |
| Thumbnail          | Content Service                                      |
| Skill health chart | GetAggregatedInsights (LAST_30_DAYS)                 |
| trend              | (not in RPC)                                         |




# MODULE DETAILS – GraphQL Schema

## **Module Details Type**
```
type ModuleDetails {
  id: ID!
  title: String!
  scenario: ScenarioDetails
  persona: PersonaCard
  objectives: [String!]!
  skills: [Skill!]!
  productContext: String
}
```

Query
```
extebd type Query {
  dashboard(userId: ID!): Dashboard
  moduleDetails(roleplayId: ID!, userId: ID!): ModuleDetails
  userPersonas(userId: ID!): [PersonaCard!]!
}
```

Mutations ( CONFUSION )
```
extends type Mutation {
  updateModuleDetails(input: UpdateModuleDetailsInput!): UpdateModuleDetailsPayload
}
```

```
input UpdateModuleDetailsInput {
  roleplayId: ID!
  personaId: ID!
  productContext: String
}
```

```
type UpdateModuleDetailsPayload {
  success: Boolean!
}
```

**Backing RPC**
- PncRoleplayCrudService.CustomizePersonalisedRoleplay

### **Update Persona (Persona Service)**
Used for editing persona attributes:
- Thumbnail
- Name
- Job title
- Company
- Behavioural traits

```
extend type Mutation {
  updatePersona(input: UpdatePersonaInput!): UpdatePersonaPayload
}
```

```
input UpdatePersonaInput {
  personaId: ID!
  name: String
  jobTitle: String
  companyName: String
  avatarUrl: String
  behaviouralTraits: [String!]
}
```

```
type UpdatePersonaPayload {
  success: Boolean!
  persona: PersonaCard
}
```

**Backing RPC**
- Persona Service → UpdatePersona (new RPC) ( TBD )

## **RPC Alignment Summary (Incremental)**

| **GQL Operation**   | **Backing RPC / Service**                            |
| ------------------- | ---------------------------------------------------- |
| moduleDetails       | PncRoleplayService.GetRoleplayDetailsForNewAttempt   |
| userPersonas        | Persona Service                                      |
| updateModuleDetails | PncRoleplayCrudService.CustomizePersonalisedRoleplay |
| updatePersona       | Persona Service.UpdatePersona                        |

## **Notes / Constraints**
- Persona attributes are **owned and mutated only by Persona Service**
- Roleplay service stores only:
    - persona_id
    - product_context
- Same updateModuleDetails mutation is reused for:
    - Persona selection from drawer
    - Product context edits
- FE controls edit flow and field combinations



# ROLEPLAY ATTEMPT – GraphQL Schema

```
extend type Query {
  roleplaySessionConfig(roleplayId: ID!, userId: ID!): RoleplaySessionConfig
}
```

```
type RoleplaySessionConfig {
  roleplayId: ID!
  botProvider: String
  botId: String
  module: ModuleDetails
  persona: PersonaCard
}
```

### **Backing RPC**
**PncRoleplayService**
- GetRoleplayDetailsForNewAttempt
#### **Field Mapping**

| **GQL Field** | **RPC Field**                     |
| ------------- | --------------------------------- |
| botProvider   | external_call_provider            |
| botId         | external_call_provider_bot_id     |
| module.*      | GetRoleplayDetailsForNewAttempt   |
| persona.id    | persona_id (then Persona Service) |

## **Mutation Additions – Call Lifecycle**

### **Start Roleplay Attempt**
Called **after Vapi session is created** and FE receives a call_id.

```
extend type Mutation {
  startRoleplayAttempt(input: StartRoleplayAttemptInput!): StartRoleplayAttemptPayload
}
```

```
input StartRoleplayAttemptInput {
  roleplayId: ID!
  userId: ID!
  callId: String!
}
```

```
type StartRoleplayAttemptPayload {
  attemptNumber: Int!
}
```

### **Backing RPC**
**PncRoleplayService**
- StartRoleplayAttempt
```
StartRoleplayAttemptRequest {
  roleplay_id
  user_id
  bot_vendor_interaction_id  // Vapi call_id
}
```

### **End Roleplay Attempt**
Called when the call ends.

```
extend type Mutation {
  endRoleplayAttempt(input: EndRoleplayAttemptInput!): Boolean!
}
```

```
input EndRoleplayAttemptInput {
  roleplayId: ID!
  userId: ID!
  attemptNumber: Int!
}
```

### **Backing RPC**
**PncRoleplayService**
- EndRoleplayAttempt
> This triggers async jobs for transcript + media processing.

## **Query Additions – Post Call Polling**
FE polls this query to check:
- Transcript availability
- Media availability
- Analysis readiness (future)

```
extend type Query {
  roleplayAttemptStatus(
    roleplayId: ID!
    userId: ID!
    attemptNumber: Int
  ): RoleplayAttemptStatus
}
```

## **Attempt Status (Union-based)**
```
union RoleplayAttemptStatus =
    AttemptInProgress
  | AttemptNotSavedForAnalysis
  | AttemptSavedForAnalysis
```

### **Attempt In Progress**
```
type AttemptInProgress {
  status: String! # IN_PROGRESS
}
```

### **Attempt Completed (Not Saved for Analysis)**
```
type AttemptNotSavedForAnalysis {
  status: String! # COMPLETED
  recordingMedia: RecordingMedia
  transcript: Transcript
}
```

### **Attempt Completed & Saved for Analysis**
```
type AttemptSavedForAnalysis {
  status: String! # ANALYZED
  recordingMedia: RecordingMedia
  transcript: Transcript
  insights: LearnerRoleplayInsightsAndScore
}
```

## **Media & Transcript Types**
```
type RecordingMedia {
  mediaId: String
  mediaUrl: String
}

type Transcript {
  isAvailable: Boolean!
  text: String
}
```


## **Backing RPC – Polling**
**PncRoleplayService**
- GetRoleplayAttemptDetailsForLearner
RPC Behavior:
- If transcript/media not ready → partial response
- If analysis saved → insights populated
### **Field Mapping**

| **GQL Field**          | **RPC Field**                    |
| ---------------------- | -------------------------------- |
| recordingMedia.mediaId | recording_media_id               |
| transcript             | fetched via async transcript job |
| insights               | LearnerRoleplayInsightsAndScore  |

## **Mutation – Save & Generate Analysis**
```
extend type Mutation {
  saveAndGenerateAnalysis(
    roleplayId: ID!
    userId: ID!
    attemptNumber: Int!
  ): Boolean!
}
```

### **Backing RPC**
**PncRoleplayService**
- SaveAndGenerateAnalysisAsync

## **End-to-End Roleplay Page Flow (Aligned)**
1. FE calls roleplaySessionConfig
2. FE passes botId + persona + module to Vapi
3. Vapi returns call_id
4. FE calls startRoleplayAttempt
5. Call ends
6. FE calls endRoleplayAttempt
7. BE triggers transcript + media jobs
8. FE polls roleplayAttemptStatus
9. Transcript / Media appear when ready
10. (Optional) FE triggers saveAndGenerateAnalysis



# CALL INSIGHTS – GraphQL Schema

## **Query Additions**

```
extend type Query {
  roleplayCallInsights(
    roleplayId: ID!
    userId: ID!
    attemptNumber: Int!
  ): RoleplayCallInsights
}
```

## **Roleplay Call Insights Root**
```
type RoleplayCallInsights {
  status: CallInsightsStatus!
  # 1. Growth areas & strengths
  growthInsights: [String!]!
  strengthInsights: [String!]!
  # 2. Objectives achieved
  objectives: [ObjectiveInsight!]!
  # 3. Performance snapshot
  performanceSnapshot: PerformanceSnapshot!
  # Media (already available before insights page)
  recordingMedia: RecordingMedia
}
```

## **Status Enum**
```
enum CallInsightsStatus {
  PROCESSING
  READY
}
```
- PROCESSING → FE continues polling
- READY → All insights available

## **Objective Insights**
```
type ObjectiveInsight {
  objective: String!
  achieved: Boolean!
}
```

## **Performance Snapshot**
```
type PerformanceSnapshot {
  coreSkills: [SkillPerformance!]!
  softSkills: SoftSkillPerformance
}
```

## **Core Skills Performance**
```
type SkillPerformance {
  skill: Skill!
  score: Int!
  growthInsights: [String!]!
  strengthInsights: [String!]!
}
```


## **Soft Skills Performance**
```
type SoftSkillPerformance {
  talkPercentage: Int
  pace: Int
  averageFillerWords: Int
  longestMonologueSeconds: Int
}
```


## **Backing RPC Alignment**

### **Primary RPC (Polling Source)**
**PncRoleplayService**
- GetRoleplayAttemptDetailsForLearner
This RPC returns different shapes based on attempt state.

### **RPC → GQL Mapping**
#### **Status**
- PROCESSING
    - Returned when:
        - Insights not yet saved
        - Analysis still running
- READY
    - Returned when:
        - saved_for_analysis_details is present

### **Growth & Strength Insights**

| **GQL Field**    | **RPC Field**                                             |
| ---------------- | --------------------------------------------------------- |
| growthInsights   | LearnerRoleplayInsightsAndScore.overall_growth_insights   |
| strengthInsights | LearnerRoleplayInsightsAndScore.overall_strength_insights |
### **Objectives**
Mapped from:
```
map<string, bool> objective_completion_status
```
→ converted to:
```
ObjectiveInsight {
  objective
  achieved
}
```

### **Core Skills**
Mapped from: 
```
repeated CompetencyScoreAndInsights
```

| **GQL Field**    | **RPC Field**     |
| ---------------- | ----------------- |
| skill.id         | competency_tag_id |
| score            | score             |
| growthInsights   | growth_insights   |
| strengthInsights | strength_insights |

Skill name resolved via **Competency Service**.

### **Soft Skills**
Mapped from:
```
repeated SoftSkillScore
```

| **Soft Skill**          | **RPC Metric**    |
| ----------------------- | ----------------- |
| talkPercentage          | TALK_PERCENTAGE   |
| pace                    | SPEECH_PACE       |
| averageFillerWords      | FILLER_WORD_COUNT |
| longestMonologueSeconds | LONGEST_MONOLOGUE |
> Metric-to-field mapping is handled in GQL.

### **Recording Media**
```
recordingMedia: RecordingMedia
```
- **RPC field**: recording_media_id
- **Resolved via**: Media / Content Service
- Media is assumed available before navigating to Insights page.

## **Polling Behavior (FE Contract)**
- FE polls roleplayCallInsights
- If status = PROCESSING:
    - Show loader
    - Disable interactions
- If status = READY:
    - Render full insights UI



# My Roleplays Tab – Schema

```
extend type Query {
  myRoleplays(
    userId: ID!
    input: MyRoleplaysInput!
  ): MyRoleplaysConnection!
}
```

## **Input – Filters, Sorting, Pagination**
```
input MyRoleplaysInput {
  searchText: String
  skillIds: [ID!]

  sortBy: MyRoleplaysSortBy
  sortOrder: SortOrder

  pagination: CursorPaginationInput!
}
```

```
enum MyRoleplaysSortBy {
  SCORE
  PRACTICED_ON
}
```

```
enum SortOrder {
  ASC
  DESC
}
```

```
input CursorPaginationInput {
  cursor: String
  limit: Int!
}
```
> FE uses cursor for infinite scrolling.

## **Connection & Edge Pattern**
```
type MyRoleplaysConnection {
  edges: [MyRoleplayEdge!]!
  pageInfo: PageInfo!
}
```

```
type MyRoleplayEdge {
  cursor: String!
  node: MyRoleplayRow!
}
```

```
type PageInfo {
  hasNextPage: Boolean!
  endCursor: String
}
```

## **Table Row Model**
```
type MyRoleplayRow {
  roleplayId: ID!
  attemptNumber: Int!

  title: String!

  score: Int
  skills: [Skill!]!

  practiceTimeSeconds: Int
  practicedOn: DateTime
}
```


## **Backing RPC Alignment**

**PncRoleplayStatsService**
- ListRoleplayAttempts
```
ListRoleplayAttemptsRequest {
  user_id
  page_number
  page_size
  roleplay_attempt_filter {
    search_text
    competencies
    sort_by
  }
}
```

## **RPC → GQL Mapping**

|**GQL Field**|**RPC Field**|
|---|---|
|roleplayId|roleplay_id|
|attemptNumber|attempt_number|
|title|title|
|score|score|
|practiceTimeSeconds|practice_time_in_seconds|
|practicedOn|attempt_date|
|searchText|roleplay_attempt_filter.search_text|
|skillIds|roleplay_attempt_filter.competencies|
|sortBy=SCORE|sort_by|
|sortBy=PRACTICED_ON|derived (date sort)|

## **Pagination Mapping**
- RPC is **page-based**
- GQL exposes **cursor-based pagination**
- Cursor = base64-encoded page_number
- limit → page_size

















