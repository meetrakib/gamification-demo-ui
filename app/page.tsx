"use client";

import { useCallback, useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_V1 = `${API_URL}/api/v1`;

type Quest = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  quest_type: string;
  rules: Record<string, unknown>;
  reward: Record<string, unknown>;
  is_active: boolean;
};

type UserProgress = {
  id: number;
  user_id: string;
  quest_id: number;
  state: string;
  progress_payload: Record<string, unknown>;
  completed_at: string | null;
  reward_claimed_at: string | null;
};

export default function Home() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loadingQuests, setLoadingQuests] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [eventUserId, setEventUserId] = useState("user-1");
  const [eventType, setEventType] = useState("trade");
  const [eventPayload, setEventPayload] = useState('{"volume_usd": 100}');
  const [progressUserId, setProgressUserId] = useState("user-1");
  const [submitting, setSubmitting] = useState(false);
  const [claimingQuestId, setClaimingQuestId] = useState<number | null>(null);

  const fetchQuests = useCallback(async () => {
    setLoadingQuests(true);
    setError(null);
    try {
      const res = await fetch(`${API_V1}/quests`);
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setQuests(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load quests");
      setQuests([]);
    } finally {
      setLoadingQuests(false);
    }
  }, []);

  const fetchProgress = useCallback(async (userId: string) => {
    if (!userId.trim()) return;
    setLoadingProgress(true);
    setError(null);
    try {
      const res = await fetch(`${API_V1}/users/${encodeURIComponent(userId)}/progress`);
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setProgress(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load progress");
      setProgress([]);
    } finally {
      setLoadingProgress(false);
    }
  }, []);

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      let payload: Record<string, unknown> = {};
      try {
        payload = JSON.parse(eventPayload || "{}");
      } catch {
        payload = {};
      }
      const res = await fetch(`${API_V1}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: eventUserId,
          event_type: eventType,
          payload,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).detail?.toString() || res.statusText);
      setSuccess("Event sent. Progress updated.");
      fetchProgress(eventUserId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send event");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoadProgress = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProgress(progressUserId);
  };

  const handleClaimReward = async (questId: number) => {
    setClaimingQuestId(questId);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(
        `${API_V1}/users/${encodeURIComponent(progressUserId)}/quests/${questId}/claim`,
        { method: "POST" }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(typeof data.detail === "string" ? data.detail : "Claim failed");
      }
      setSuccess("Reward claimed.");
      fetchProgress(progressUserId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to claim");
    } finally {
      setClaimingQuestId(null);
    }
  };

  return (
    <main>
      <h1>Gamification Demo</h1>
      <p style={{ color: "#a1a1aa", marginBottom: "1.5rem" }}>
        API: <code>{API_URL}</code>
      </p>

      <section>
        <h2>Quests</h2>
        {loadingQuests ? (
          <p>Loading quests…</p>
        ) : quests.length === 0 ? (
          <p>No quests. Start the gamification-core API and refresh.</p>
        ) : (
          <ul>
            {quests.map((q) => (
              <li key={q.id} className="card">
                <strong>{q.name}</strong>
                <span className="badge">{q.quest_type}</span>
                {q.description && <p>{q.description}</p>}
                <p>Rules: {JSON.stringify(q.rules)} → Reward: {JSON.stringify(q.reward)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Report event</h2>
        <form onSubmit={handleSubmitEvent}>
          <div className="form-row">
            <label>User ID</label>
            <input
              value={eventUserId}
              onChange={(e) => setEventUserId(e.target.value)}
              placeholder="user-1"
            />
          </div>
          <div className="form-row">
            <label>Event type</label>
            <input
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              placeholder="trade"
            />
          </div>
          <div className="form-row">
            <label>Payload (JSON)</label>
            <input
              value={eventPayload}
              onChange={(e) => setEventPayload(e.target.value)}
              placeholder='{"volume_usd": 100}'
            />
          </div>
          <button type="submit" disabled={submitting}>
            {submitting ? "Sending…" : "Send event"}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </section>

      <section>
        <h2>My progress</h2>
        <form onSubmit={handleLoadProgress}>
          <div className="form-row">
            <label>User ID</label>
            <input
              value={progressUserId}
              onChange={(e) => setProgressUserId(e.target.value)}
              placeholder="user-1"
            />
          </div>
          <button type="submit" disabled={loadingProgress}>
            {loadingProgress ? "Loading…" : "Load progress"}
          </button>
        </form>
        {progress.length === 0 && !loadingProgress && progressUserId && (
          <p>No progress yet. Report events for this user.</p>
        )}
        {progress.length > 0 && (
          <ul>
            {progress.map((p) => (
              <li key={p.id} className="card">
                <strong>Quest ID {p.quest_id}</strong>
                <span className="badge">{p.state}</span>
                <p>Progress: {JSON.stringify(p.progress_payload)}</p>
                {p.completed_at && <p>Completed: {new Date(p.completed_at).toLocaleString()}</p>}
                {p.state === "completed" && (
                  <button
                    type="button"
                    onClick={() => handleClaimReward(p.quest_id)}
                    disabled={claimingQuestId === p.quest_id}
                    style={{ marginTop: "0.5rem" }}
                  >
                    {claimingQuestId === p.quest_id ? "Claiming…" : "Claim reward"}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
