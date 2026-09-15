import { NextResponse } from "next/server";
import { exportTrainingData, getTrainingStats } from "@/lib/training-data-logger";
import { verifyBearerSecret } from "@/lib/api-helpers";

export async function GET(req: Request) {
  if (!verifyBearerSecret(req, process.env.ADMIN_TRAINING_EXPORT_TOKEN)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const format = url.searchParams.get("format");

  if (format === "jsonl") {
    const jsonl = await exportTrainingData();
    return new Response(jsonl, {
      headers: {
        "Content-Type": "application/jsonl",
        "Content-Disposition": "attachment; filename=admitpath-training-data.jsonl",
        "Cache-Control": "private, no-store, max-age=0",
      },
    });
  }

  const stats = await getTrainingStats();
  return NextResponse.json(stats, {
    headers: { "Cache-Control": "private, no-store, max-age=0" },
  });
}
