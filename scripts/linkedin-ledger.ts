import { publicationStore } from "../src/app/lib/linkedin/config.ts";
const [action, id, value] = process.argv.slice(2);
if (!id || !["status", "retry", "mark-published"].includes(action))
  throw new Error(
    "Usage: linkedin-ledger.ts status POST_ID | retry POST_ID --confirmed-not-published | mark-published POST_ID LINKEDIN_URN",
  );
const author = process.env.LINKEDIN_MEMBER_URN;
const siteUrl = process.env.SITE_URL;
if (!author || !siteUrl)
  throw new Error("Set the account URN and canonical site URL");
const store = publicationStore({ author, siteUrl: new URL(siteUrl).origin });
const previous = await store.get(id);
if (!previous) throw new Error("No publication record for this post");
if (action === "status") console.log(JSON.stringify(previous, null, 2));
else {
  if (
    action === "retry" &&
    (previous.status === "published" || value !== "--confirmed-not-published")
  )
    throw new Error(
      "Confirm that the post does not exist on LinkedIn before retrying. Published records cannot be retried.",
    );
  if (
    action === "mark-published" &&
    !/^urn:li:(share|ugcPost):[a-zA-Z0-9_-]+$/.test(value || "")
  )
    throw new Error("Provide the confirmed LinkedIn post URN");
  const next =
    action === "retry"
      ? {
          status: "pending" as const,
          attempts: 0,
          updatedAt: new Date().toISOString(),
        }
      : {
          ...previous,
          status: "published" as const,
          linkedinId: value,
          updatedAt: new Date().toISOString(),
        };
  if (!(await store.compareAndSet(id, previous, next)))
    throw new Error("Publication changed concurrently. Read its status again.");
  console.log(`Publication marked ${next.status}`);
}
