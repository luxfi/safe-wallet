# Implementation Plan: Refactor Earn Feature

**Branch**: `002-refactor-earn-feature` | **Date**: 2026-01-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-refactor-earn-feature/spec.md`

## Summary

Refactor the earn feature to follow the standard feature architecture pattern established in 001-feature-architecture. This involves reorganizing the folder structure, creating proper public API boundaries through barrel exports, ensuring lazy loading compliance, centralizing TypeScript types, and preserving 100% of existing functionality. The refactoring follows the proven walletconnect reference implementation pattern.

## Technical Context

**Language/Version**: TypeScript 5.x (Next.js web application)  
**Primary Dependencies**: React 18, Next.js 14, MUI, ethers.js, @safe-global/utils  
**Storage**: Browser LocalStorage (for consent state), CGW API chain configs (for feature flags)  
**Testing**: Jest, React Testing Library  
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge)  
**Project Type**: Web (Next.js monorepo workspace)  
**Performance Goals**: Code splitting to prevent earn code from loading when feature disabled; lazy loading on-demand  
**Constraints**:

- Zero functional changes (pure refactoring)
- All existing tests must pass without modification
- External imports must be updated to use new public API
- Bundle must not include earn code when EARN feature flag is disabled  
  **Scale/Scope**:
- 1 feature with ~10 components
- 2 external import locations to update (Assets dashboard widget, AssetsTable PromoButtons)
- 2 hooks, 1 utility service file
- Kiln widget integration (third-party iframe)

## Constitution Check (Post-Phase 1 Re-evaluation)

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### ✅ Monorepo Unity

**Status**: PASS - No violations

- This is a web-only feature (no shared packages affected)
- Refactoring does not touch mobile or shared code
- All changes are isolated to `apps/web/src/features/earn/`

**Post-Phase 1 Confirmation**: No new violations introduced. Research and design confirm all work is web-only.

### ✅ Type Safety

**Status**: PASS - No violations

- All code uses TypeScript with explicit types
- No `any` type usage detected in current earn feature code
- Refactoring will centralize types in `types.ts` (improvement)
- Type-check will be run before committing

**Post-Phase 1 Confirmation**: Types extracted to `types.ts` follow strict typing. `EarnButtonProps` interface defined without `any` types. Feature module contract documents all public types.

### ✅ Test-First Development

**Status**: PASS - No violations

- Existing tests will be preserved without modification (per requirement FR-021)
- No new business logic is being added (pure refactoring)
- All existing test coverage remains intact

**Post-Phase 1 Confirmation**: Research revealed zero existing automated tests. Manual testing checklist created to validate functionality preservation. This is acceptable for a pure refactoring task.

### ✅ Design System Compliance

**Status**: PASS - No violations

- Earn feature currently uses MUI components and theme variables
- No changes to UI rendering or styling in this refactoring
- Storybook stories exist for VaultDepositConfirmation and VaultRedeemConfirmation
- Stories will be preserved during folder reorganization

**Post-Phase 1 Confirmation**: Design system usage remains unchanged. No new components require Storybook stories. Existing stories will remain in their component directories.

### ✅ Safe-Specific Security

**Status**: PASS - No violations

- Earn feature uses asset addresses and chain IDs correctly
- No transaction building or signature flows in earn feature (delegates to Kiln widget)
- Geoblocking and blocked address checks are preserved (per FR-023)
- No security-sensitive patterns are being modified

**Post-Phase 1 Confirmation**: Data model confirms proper handling of geoblocking (GeoblockingContext), blocked addresses (useBlockedAddress hook), and asset validation (isEligibleEarnToken utility). No security-sensitive changes in refactoring.

**Final Conclusion**: All constitutional principles satisfied after Phase 1 design. No violations requiring justification. Ready to proceed to Phase 2 (Task Breakdown).

## Project Structure

### Documentation (this feature)

```text
specs/002-refactor-earn-feature/
├── spec.md                # Feature specification (COMPLETED ✅)
├── checklists/
│   └── requirements.md    # Spec quality checklist (COMPLETED ✅)
├── plan.md                # This file (COMPLETED ✅)
├── research.md            # Phase 0 output (COMPLETED ✅)
├── data-model.md          # Phase 1 output (COMPLETED ✅)
├── quickstart.md          # Phase 1 output (COMPLETED ✅)
├── contracts/             # Phase 1 output (COMPLETED ✅)
│   └── feature-module.ts  # TypeScript interface contract for earn feature
└── tasks.md               # Phase 2 output (/speckit.tasks command - PENDING)
```

### Source Code (repository root)

**Current Structure** (to be refactored):

```text
apps/web/src/features/earn/
├── index.tsx              # Main component (currently .tsx, needs to become barrel file)
├── constants.ts           # ✅ Already exists
├── utils.ts               # ⚠️ Should be moved to services/
├── components/
│   ├── EarnButton/        # ⚠️ No barrel export
│   ├── EarnInfo/
│   ├── EarnView/
│   ├── EarnWidget/
│   ├── VaultDepositConfirmation/
│   ├── VaultDepositTxDetails/
│   ├── VaultDepositTxInfo/
│   ├── VaultRedeemConfirmation/
│   ├── VaultRedeemTxDetails/
│   └── VaultRedeemTxInfo/
└── hooks/
    ├── useGetWidgetUrl.ts
    └── useIsEarnFeatureEnabled.ts  # ✅ Already exists

Missing:
- hooks/index.ts (barrel export)
- components/index.ts (barrel export)
- services/ directory
- services/index.ts (barrel export)
- types.ts (centralized types)
- Public API in index.ts
```

**Target Structure** (standard pattern):

```text
apps/web/src/features/earn/
├── index.ts               # 🔄 Public API barrel file (rename from index.tsx)
├── types.ts               # ➕ NEW - Centralized TypeScript interfaces
├── constants.ts           # ✅ Already exists
├── components/
│   ├── index.ts           # ➕ NEW - Component barrel export
│   ├── EarnPage/          # 🔄 RENAMED from index.tsx (main component)
│   ├── EarnButton/        # Public component (exported)
│   ├── EarnInfo/          # Internal component (not exported)
│   ├── EarnView/          # Internal component (not exported)
│   ├── EarnWidget/        # Internal component (not exported)
│   ├── VaultDepositConfirmation/
│   ├── VaultDepositTxDetails/
│   ├── VaultDepositTxInfo/
│   ├── VaultRedeemConfirmation/
│   ├── VaultRedeemTxDetails/
│   └── VaultRedeemTxInfo/
├── hooks/
│   ├── index.ts           # ➕ NEW - Hook barrel export
│   ├── useIsEarnFeatureEnabled.ts  # ✅ Public hook
│   └── useGetWidgetUrl.ts          # Internal hook
└── services/
    ├── index.ts           # ➕ NEW - Service barrel export
    └── utils.ts           # 🔄 MOVED from root
```

**Structure Decision**: Web application structure selected because this is a Next.js feature within the web monorepo workspace (`apps/web/`). The feature follows the standard pattern documented in `apps/web/docs/feature-architecture.md` with components, hooks, services, and types organized into dedicated subdirectories with barrel exports. The main `index.ts` at the feature root exposes only the public API to prevent tight coupling with external code.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

_No violations detected - this section intentionally left empty._

---

## Phase 0: Research & Decisions ✅

**Status**: COMPLETED

### Research Completed

1. ✅ **External dependencies mapped**: 2 component imports for `EarnButton`, 1 hook import for `useIsEarnFeatureEnabled`
2. ✅ **Public API surface defined**: Default export (EarnPage), EarnButton, useIsEarnFeatureEnabled, EarnButtonProps type
3. ✅ **Type extraction strategy determined**: Extract `EarnButtonProps` to `types.ts`; keep simple inline types
4. ✅ **Analytics tracking pattern confirmed**: Keep in global service (`@/services/analytics/events/earn`)
5. ✅ **Feature flag pattern validated**: Add `undefined` return type to preserve loading state
6. ✅ **Test strategy defined**: Manual testing checklist (no automated tests exist currently)
7. ✅ **Barrel export structure determined**: Follow walletconnect reference pattern exactly

### Key Decisions Documented

| Decision Area               | Choice                                                | Rationale                                        |
| --------------------------- | ----------------------------------------------------- | ------------------------------------------------ |
| **Public API Components**   | `EarnButton` only                                     | Only component used outside feature              |
| **Public API Hooks**        | `useIsEarnFeatureEnabled` only                        | Only hook used outside feature                   |
| **Public API Types**        | `EarnButtonProps` only                                | Only type needed by external consumers           |
| **Analytics**               | Keep in global service                                | Already properly separated, used outside feature |
| **Feature Flag Hook**       | Add `undefined` return type                           | Preserve loading state per standard pattern      |
| **utils.ts Location**       | Move to `services/utils.ts`                           | Align with standard structure                    |
| **Type Extraction**         | Extract `EarnButtonProps`, keep simple types inline   | Balance between DRY and readability              |
| **Barrel Export Pattern**   | Follow walletconnect pattern exactly                  | Proven, compliant reference implementation       |
| **Main Component Location** | Rename `index.tsx` to `components/EarnPage/index.tsx` | Separate concerns (component vs. barrel)         |
| **Testing Strategy**        | Manual testing checklist                              | No automated tests exist currently               |

**Output**: [research.md](./research.md)

---

## Phase 1: Design & Contracts ✅

**Status**: COMPLETED

### Data Model Designed

The earn feature has a simple data model with 7 key entities:

1. **Earn Consent State**: Boolean in LocalStorage (`lendDisclaimerAcceptedV1`)
2. **Feature Flag State**: Boolean | undefined from CGW API (`FEATURES.EARN`)
3. **Geoblocking State**: Boolean from global context
4. **Blocked Address State**: string | null from backend check
5. **Asset Selection State**: string | undefined from URL query parameter (`asset_id`)
6. **Info Panel Display State**: Boolean in LocalStorage (`hideEarnInfoV2`)
7. **Widget Configuration**: Computed dynamically (URL, theme, asset_id)

No Redux store needed - state managed through React hooks and browser APIs.

**Output**: [data-model.md](./data-model.md)

### API Contracts Defined

TypeScript interface contract created defining the public API:

- Default export: `EarnPage` component (lazy-loadable)
- Named exports: `EarnButton`, `useIsEarnFeatureEnabled`, `EarnButtonProps`
- Internal components/hooks/services documented but not exported

Contract includes usage examples and migration guide for updating deep imports.

**Output**: [contracts/feature-module.ts](./contracts/feature-module.ts)

### Quickstart Guide Created

Comprehensive developer guide covering:

- Quick reference for imports and folder structure
- Usage examples for `EarnButton` and `useIsEarnFeatureEnabled`
- Development workflow (type-check, lint, test)
- Manual testing checklist (consent, geoblocking, asset selection, analytics)
- Common tasks (adding components, hooks, constants, types)
- Troubleshooting guide (type errors, bundle issues, widget problems)

**Output**: [quickstart.md](./quickstart.md)

### Agent Context Updated

✅ Claude Code context file updated with:

- Language: TypeScript 5.x (Next.js web application)
- Framework: React 18, Next.js 14, MUI, ethers.js, @safe-global/utils
- Database: Browser LocalStorage, CGW API chain configs

---

## Phase 2: Task Breakdown

**Not generated by this command.** Use `/speckit.tasks` after Phase 1 completion to generate detailed implementation tasks.

---

## Gates & Validation

### Pre-Phase 0 Gates

- ✅ Specification complete and validated (`spec.md`, `checklists/requirements.md`)
- ✅ Constitution Check passed (no violations)
- ✅ Branch created (`002-refactor-earn-feature`)
- ✅ External dependencies identified (2 import locations for `EarnButton`)

### Post-Phase 0 Gates

- ✅ All NEEDS CLARIFICATION items resolved in research.md
- ✅ Public API surface documented with rationale
- ✅ Type extraction strategy defined
- ✅ All research decisions documented

### Post-Phase 1 Gates

- ✅ `data-model.md` complete with entity definitions
- ✅ `contracts/feature-module.ts` complete with TypeScript interfaces
- ✅ `quickstart.md` complete with developer guide
- ✅ Constitution Check re-verified (remains PASS)
- ✅ Agent context updated with new patterns

### Pre-Implementation Gates (Phase 2)

- ✅ All Phase 0 and Phase 1 gates passed
- ⏳ `tasks.md` generated via `/speckit.tasks`
- ⏳ Task priorities and sequencing validated

---

## Notes

### Reference Implementation

This refactoring follows the walletconnect feature pattern documented in:

- `apps/web/docs/feature-architecture.md` (architecture documentation)
- `apps/web/src/features/walletconnect/` (reference implementation)

Key patterns from walletconnect to replicate:

1. Main `index.ts` uses `dynamic()` for default export component
2. Types exported both individually and via barrel file
3. Hooks barrel exports all public hooks
4. Constants exported selectively (only public constants)
5. Services barrel exports utilities and service functions

### External Dependencies

**Confirmed external imports** (must be updated):

1. `apps/web/src/components/dashboard/Assets/index.tsx` - imports `EarnButton`
2. `apps/web/src/components/balances/AssetsTable/PromoButtons.tsx` - imports `EarnButton`
3. `apps/web/src/components/dashboard/index.tsx` - imports `useIsEarnFeatureEnabled`

These imports currently use deep paths:

```typescript
import EarnButton from '@/features/earn/components/EarnButton'
import { useIsEarnFeatureEnabled as useIsEarnPromoEnabled } from '@/features/earn/hooks/useIsEarnFeatureEnabled'
```

After refactoring, they must use:

```typescript
import { EarnButton } from '@/features/earn'
import { useIsEarnFeatureEnabled as useIsEarnPromoEnabled } from '@/features/earn'
```

### Lazy Loading Current Status

The earn page (`apps/web/src/pages/earn.tsx`) already uses `dynamic()` import:

```typescript
const LazyEarnPage = dynamic(() => import('@/features/earn'), { ssr: false })
```

This is correct and compliant. However, the current `@/features/earn` exports the main component as default from `index.tsx`. After refactoring to `index.ts`, the pattern will be preserved but the file extension changes.

### Testing Strategy

- All existing tests will remain in their current locations (colocated with components/hooks)
- No test modifications should be necessary as the refactoring preserves all functionality
- Tests will be run before committing to validate no regressions
- Bundle analysis will be performed to verify code splitting works correctly
- Manual testing checklist provided in `quickstart.md` (no automated tests exist currently)

### Risk Areas

1. **External imports**: The three external import locations must be updated correctly or the app will fail to build
2. **Type extraction**: Inline types must be extracted carefully to avoid breaking type inference
3. **Barrel export ordering**: Circular dependencies could arise if barrel exports are not structured correctly
4. **Analytics events**: Analytics remain in global service (no extraction needed)

### Success Validation

After implementation, validate success by:

1. ✅ Running type-check: `pnpm --filter @safe-global/web type-check`
2. ✅ Running tests: `pnpm --filter @safe-global/web test`
3. ✅ Running lint: `pnpm --filter @safe-global/web lint`
4. ✅ Bundle analysis to confirm code splitting
5. ✅ Manual testing of earn flows (consent, widget, asset selection)
6. ✅ Verify external imports use `@/features/earn` (no deep paths)

---

## Summary

**Phase 0 (Research)** ✅: Completed - All unknowns resolved, public API defined, decisions documented  
**Phase 1 (Design)** ✅: Completed - Data model, contracts, and quickstart guide created  
**Phase 2 (Tasks)** ⏳: Pending - Run `/speckit.tasks` to generate implementation tasks

**Next Command**: `/speckit.tasks` to break down the implementation into actionable tasks
