import type { ScenarioLikelihood } from '../../models/probability/scenarioLikelihood';
import { newId } from '../../utils/ids';

export async function replaceScenarioProbabilities(
  db: D1Database,
  matchId: string,
  scenarios: ScenarioLikelihood[],
  modelVersion: string,
  inputHash: string,
): Promise<void> {
  await db.prepare('DELETE FROM scenario_probabilities WHERE match_id = ?').bind(matchId).run();
  for (const s of scenarios) {
    await db
      .prepare(
        `INSERT INTO scenario_probabilities (
          id, match_id, scenario_type, probability, confidence, model_version, input_hash, explanation_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        newId('sc'),
        matchId,
        s.scenarioType,
        s.probability,
        s.confidence,
        modelVersion,
        inputHash,
        JSON.stringify({ explanationFactors: s.explanationFactors }),
      )
      .run();
  }
}

export async function listScenariosForMatch(db: D1Database, matchId: string) {
  const { results } = await db
    .prepare(
      `SELECT scenario_type, probability, confidence, model_version, explanation_json, created_at
       FROM scenario_probabilities WHERE match_id = ? ORDER BY probability DESC`,
    )
    .bind(matchId)
    .all<{
      scenario_type: string;
      probability: number;
      confidence: number;
      model_version: string;
      explanation_json: string | null;
      created_at: string;
    }>();
  return (results ?? []).map((r) => ({
    scenarioType: r.scenario_type,
    probability: r.probability,
    confidence: r.confidence,
    modelVersion: r.model_version,
    explanationFactors: r.explanation_json
      ? ((JSON.parse(r.explanation_json) as { explanationFactors?: string[] }).explanationFactors ?? [])
      : [],
    createdAt: r.created_at,
  }));
}
