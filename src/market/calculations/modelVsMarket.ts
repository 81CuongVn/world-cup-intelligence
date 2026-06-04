export function calculateModelVsMarketDelta(input: {
  model: { home: number; draw: number; away: number };
  market: { home: number; draw: number; away: number };
}) {
  return {
    home: input.model.home - input.market.home,
    draw: input.model.draw - input.market.draw,
    away: input.model.away - input.market.away,
  };
}
