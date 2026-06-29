# Backend Tasks

## Phase 3: AI Workflow & Data Model Updates
- [x] Update `app/models/review.py`: Change `timestamp` to `datetime`, add `customer_id`.
- [x] Update `app/models/customer.py`: Change `last_visit` to `datetime`.
- [x] Update `app/models/campaign.py`: Change `timestamp` to `datetime`, add `recipient_ids`.
- [x] Update `app/models/coupon.py`: Change `quantity` to `Optional[int]`.
- [x] Update `app/models/insight.py`: Change `generated_date` to `datetime`.
- [x] Update `ai_workflow/agents/triage.py`: Fetch and save `customer_id`, replace `.isoformat()` with `datetime.now(timezone.utc)`.
- [x] Update `ai_workflow/agents/analysis.py`: Refactor `generate_restaurant_insights` to use `$gte` with `datetime` object.
- [x] Update routes (`dashboard.py`, `campaigns.py`, `reviews.py`, `onboard.py`, `cron.py`, `tasks.py`): Remove all `.isoformat()` when saving to DB and fix query logic.
