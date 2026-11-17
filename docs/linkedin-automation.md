# Blog → LinkedIn automation

New public blog posts can create one automatic article share on Niv's personal LinkedIn profile. This is a link share with a localized title and excerpt, not a LinkedIn long-form article. The implementation is disabled until production credentials are configured; no LinkedIn post was made during development.

## How it works

1. An authenticated worker reads the external blog API directly, without the portfolio's cache.
2. Its first run stores an activation timestamp in a durable Upstash Redis ledger and shares nothing. Older posts stay excluded.
3. Later runs find new public posts, reserve each immutable post ID atomically, and create a LinkedIn post through `POST /rest/posts`.
4. Optional signed blog webhooks persist the same pending record and start a post-response worker for prompt publication. Daily cron provides recovery and works without changes to the blog backend.
5. The ledger records the result and LinkedIn post URN. Editing a title, changing the slug, or switching the selected language does not create another share.

The current [blog backend](https://github.com/nivdantas/portfolio-back/blob/e86b84bba5420706bf694a5fa4f49ec978f72f93/src/modules/posts/index.ts) makes a created post publicly visible immediately. Accordingly, a successful `POST /posts` is publication. Its current schema has no drafts. The integration also understands optional `status` and `publishedAt` fields: drafts are excluded and an explicit publication date takes precedence over creation time. If you add draft support, ensure the public blog endpoints only expose public posts.

No publishing happens on page visits, article reads, or `/api/posts` requests.

## Production setup

Copy `.env.example` to `.env.local` for local development. Configure the equivalent server-side variables in the hosting dashboard for production. Never commit tokens or put them in `NEXT_PUBLIC_` variables.

1. Create a LinkedIn Developer app and enable **Share on LinkedIn**. Obtain an owner-authorized access token containing `w_member_social`. LinkedIn's [OAuth authorization-code flow](https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow) describes code exchange and CSRF state verification. This repository uses an operator-provided token; it does not expose a public OAuth login or store client secrets.
2. Set `LINKEDIN_MEMBER_URN` to the authenticated member's app-scoped Person URN, `urn:li:person:…`. Do not use the vanity profile URL. LinkedIn's [Share guide](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin) points to its [OIDC guide](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2) for member identity; use an identity obtained for the same app/token and verify author access when connecting. Do not assume an unrelated app's identifier will work.
3. Set `LINKEDIN_ACCESS_TOKEN` and its ISO expiry time in `LINKEDIN_ACCESS_TOKEN_EXPIRES_AT`. The worker refuses to send when expiry is unknown or within five minutes. Access tokens normally last 60 days; automatic refresh is limited to approved partners. Plan to renew the token through LinkedIn authorization. See [refresh-token restrictions](https://learn.microsoft.com/en-us/linkedin/shared/authentication/programmatic-refresh-tokens).
4. Create a persistent Upstash Redis database and set its REST URL/token. Disable eviction and retain its data across deploys. The ledger uses Redis REST commands and atomic Lua compare-and-set, with no extra client dependency. See [Upstash REST API](https://upstash.com/docs/redis/features/restapi).
5. Set `SITE_URL` to the canonical HTTPS origin (`https://nivdantas.com`) and `BLOG_API_URL` to the external blog API. `LINKEDIN_POST_LOCALE` selects `pt` or `en` independent of visitors. Both languages link to `/blog/{slug}` because the site's locale URLs have no prefix.
6. Create separate random values for `CRON_SECRET` and optional `BLOG_WEBHOOK_SECRET`. Set `LINKEDIN_PUBLISH_ENABLED=true` only in production. Vercel preview deployments are explicitly disabled.
7. Deploy and invoke the authenticated worker once to initialize its baseline **before publishing a new article or enabling webhooks**. Confirm the JSON reports `initialized: true, published: 0`. A later invocation reports `initialized: false`.

The worker endpoint is:

```http
GET https://nivdantas.com/api/automations/linkedin
Authorization: Bearer <CRON_SECRET>
```

For a private local invocation, read the secret from the environment and avoid putting it literally into a saved command:

```js
// Run from a trusted Node session whose environment contains the production secret.
const response = await fetch(
  `${process.env.SITE_URL}/api/automations/linkedin`,
  {
    headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
  },
);
console.log(response.status, await response.json());
```

`vercel.json` schedules one run daily at approximately 12:00 UTC. This is compatible with Hobby's daily cron limitation. It can take up to roughly a day to discover a post without a webhook. For a faster polling fallback, use a supported paid schedule or an external authenticated scheduler; do not set a sub-daily legacy cron on Hobby. See [Vercel cron limits](https://vercel.com/docs/schedules/cron-jobs/usage-and-pricing).

Each run attempts at most two shares to limit bursts. For higher post volume, schedule more frequent runs. Posts older than `LINKEDIN_MAX_AGE_HOURS` (default 48) are skipped to avoid publishing an old backlog after an outage.

## Optional publication webhook

This repository cannot install a webhook in the separate blog service. Add the event emission there after successful public creation, preferably through that service's transactional outbox so a process failure does not lose the event. Polling already works without that backend change.

Send to `POST /api/automations/linkedin`:

```json
{
  "type": "post.published",
  "postId": "the-immutable-blog-id",
  "slug": "the-article-slug"
}
```

Headers:

```http
Content-Type: application/json
X-Blog-Timestamp: <current UNIX seconds>
X-Blog-Signature: sha256=<hex HMAC-SHA256(secret, timestamp + "." + exactRawBody)>
```

Signing example for the blog service:

```ts
import { createHmac } from "node:crypto";

const raw = JSON.stringify({
  type: "post.published",
  postId: post.id,
  slug: post.slug,
});
const timestamp = String(Math.floor(Date.now() / 1000));
const signature = createHmac("sha256", process.env.BLOG_WEBHOOK_SECRET!)
  .update(`${timestamp}.${raw}`)
  .digest("hex");

const response = await fetch(
  `${process.env.PORTFOLIO_URL}/api/automations/linkedin`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Blog-Timestamp": timestamp,
      "X-Blog-Signature": `sha256=${signature}`,
    },
    body: raw,
    signal: AbortSignal.timeout(15000),
  },
);
// Persist failures in the producer's outbox and retry with a new timestamp/signature.
if (!response.ok)
  throw new Error(`Publication event delivery failed: ${response.status}`);
```

The receiver verifies the exact body, allows a five-minute clock window, limits payloads to 16 KiB, and fetches the canonical public post from the configured blog service rather than trusting event content. It acknowledges `202` after the reservation is durable. A duplicate event is harmless. A post-response worker starts immediately; cron can pick up unfinished pending work. A function interrupted after dispatch leaves a held reservation, not an automatic resend.

## Failure handling and operations

| Result                                             | Behavior                                                                                             |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `201`                                              | Mark published, save `x-restli-id` when supplied. A missing ID does not trigger a duplicate.         |
| `409`, `429`                                       | Retry on a later worker run after `Retry-After` or the default one hour, with at most five attempts. |
| `401`                                              | Hold as `auth_required`; renew credentials and then explicitly reset that record.                    |
| `400`, `403`, `404`, `422`                         | Hold as `rejected`; fix the author, permissions, or content before retrying.                         |
| Timeout, network loss, unexpected status, or `5xx` | Hold as `needs_review`; creation may already have succeeded.                                         |
| Worker dies after reservation                      | Keep `sending`; manually inspect LinkedIn before resolving.                                          |
| Storage/configuration failure                      | Fail closed and return `503`.                                                                        |

The worker uses a distributed account lock and permanent per-post reservations. LinkedIn does not document a create-post idempotency key. This implementation prioritizes avoiding duplicate posts and does **not** promise exactly-once delivery. Ambiguous failures require inspection; member-post read permissions are restricted, so automatic reconciliation cannot be assumed.

With production Redis credentials in your private `.env.local`, inspect or resolve a record:

```sh
npm run linkedin:ledger -- status BLOG_POST_ID
npm run linkedin:ledger -- mark-published BLOG_POST_ID urn:li:share:CONFIRMED_ID
npm run linkedin:ledger -- retry BLOG_POST_ID --confirmed-not-published
```

Only use retry after confirming the share is absent and addressing its cause. Never reset an actively running `sending` record. Published records cannot be retried by this tool. Do not delete the ledger or baseline as a recovery technique. Changing account URN or canonical site origin selects a separate ledger namespace and requires fresh initialization.

Monitor worker `503` responses and hosting logs for `LinkedIn publication requires attention`. The implementation logs IDs/statuses, never tokens or article bodies. Configure your existing hosting monitor to alert on failed cron executions; the repository does not send alerts to an external messaging account.

The Posts API version defaults to `202610` and can be changed through `LINKEDIN_API_VERSION`. Review LinkedIn's [supported versions](https://learn.microsoft.com/en-us/linkedin/marketing/versioning) periodically. Article title, source, and description are supplied explicitly; no thumbnail is uploaded. LinkedIn does not scrape article URLs for these API posts. See the [Posts API](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api?view=li-lms-2026-10).

## Validation

`npm test` exercises activation, old/future/draft exclusion, delayed publication, concurrent events, duplicate/edit delivery, rate limiting, ambiguous success, process death, storage failure, corrupted baseline, signatures, and actual LinkedIn response classification. HTTP calls are mocked and no real share is created. After a production build, `npm run test:http` checks real HTTP routing, bilingual pages, Markdown rendering, draft/missing article 404s, and publishing authentication against a local fixture backend. The script starts and stops its own servers.

Before enabling production, verify the canonical blog URL is accessible, the authorized member identity is correct, the Redis database persists, and the initial worker creates only its baseline. The first real new article then follows the authorized automatic publication path.
