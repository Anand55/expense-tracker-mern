# Task 1 — Decision-Making and AI  
**Topic:** Choosing Database for a Monthly Donation Subscription System

## AI Prompt Used
"Should I use a MongoDB or a relationship database in my project?"

## AI Response (Summary)
- MongoDB is good for flexible schemas and rapid development.
- Relational databases are better for structured data, relationships, and transactions.
- Financial or subscription systems usually benefit from relational databases.

## 1. My Decision
We choose **Relational Database (PostgreSQL)**.

- Subscription systems require strong consistency.
- Entities like users, subscriptions, and payments have clear relationships.
- Transactions are critical to avoid incorrect billing.
- Reporting and analytics are easier using SQL joins.

Short SQL example:

```sql
BEGIN;
INSERT INTO payments ...
UPDATE subscriptions ...
COMMIT;
```

## 2. Review of the AI Answer
The AI explanation was correct but generic. It helped compare options but did not strongly recommend based on domain needs. The final decision required human reasoning about financial reliability.

## 3. If MongoDB Had Already Been Chosen
- Enforce schema validation at the application level.
- Use MongoDB transactions carefully.
- Model collections similar to relational tables instead of deeply nested documents.
- Expect more complexity in reporting queries.

## Conclusion
AI assisted with understanding, but the final decision must match the data model. For a monthly donation subscription system, a relational database is the better fit due to integrity, relationships, and transactional safety.
