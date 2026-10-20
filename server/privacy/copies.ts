export type Capture = { receipt: string; jobId: string; handles: number };
export interface CopiesAdapter {
  capture(
    jobId: string,
    refs: readonly {
      deliveryId: string;
      namespace: "reply008" | "confirmation009";
    }[],
  ): Promise<Capture>;
  verify(capture: Capture, jobId: string): boolean;
  erase(jobId: string): Promise<"completed" | "pending" | "failed">;
  status(jobId: string): Promise<"completed" | "pending" | "failed">;
}
export function validateCapture(
  adapter: CopiesAdapter,
  c: Capture,
  jobId: string,
) {
  if (
    c.jobId !== jobId ||
    !Number.isInteger(c.handles) ||
    c.handles < 0 ||
    !adapter.verify(c, jobId)
  )
    throw Error("Copy capture unverified");
}

export async function reconcileCopies(
  adapter: CopiesAdapter,
  jobs: readonly string[],
) {
  const result: { jobId: string; state: "completed" | "pending" | "failed" }[] =
    [];
  for (const jobId of jobs) {
    const state = await adapter.status(jobId);
    result.push({
      jobId,
      state: state === "completed" ? state : await adapter.erase(jobId),
    });
  }
  return result;
}
