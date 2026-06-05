export interface PositionSizeInput {
  accountSize: number;
  riskPercent: number; // in percentage, e.g. 2 means 2%
  entryPrice: number;
  stopLossPrice?: number;
  stopLossPercent?: number; // in percentage, e.g. 10 means 10%
  leverage?: number; // default is 1
}

export interface PositionSizeResult {
  riskAmount: number;
  stopLossPrice: number;
  riskPerShare: number;
  shares: number;
  totalCost: number;
  leverageCost: number;
  capitalPercent: number;
}

export function calculatePositionSize(input: PositionSizeInput): PositionSizeResult {
  const {
    accountSize,
    riskPercent,
    entryPrice,
    stopLossPrice: slPrice,
    stopLossPercent: slPercent,
    leverage = 1,
  } = input;

  const defaultResult: PositionSizeResult = {
    riskAmount: 0,
    stopLossPrice: 0,
    riskPerShare: 0,
    shares: 0,
    totalCost: 0,
    leverageCost: 0,
    capitalPercent: 0,
  };

  if (accountSize <= 0 || riskPercent <= 0 || entryPrice <= 0) {
    return defaultResult;
  }

  // Calculate stop loss price if not directly provided
  let stopLossPrice = slPrice ?? 0;
  if (slPrice === undefined && slPercent !== undefined && slPercent > 0) {
    stopLossPrice = entryPrice * (1 - slPercent / 100);
  }

  // Validation: stop loss must be lower than entry price for a long position
  if (stopLossPrice >= entryPrice || stopLossPrice <= 0) {
    return defaultResult;
  }

  const riskAmount = accountSize * (riskPercent / 100);
  const riskPerShare = entryPrice - stopLossPrice;

  if (riskPerShare <= 0) {
    return defaultResult;
  }

  // Position sizing calculations
  const shares = Math.floor(riskAmount / riskPerShare);
  const totalCost = shares * entryPrice;
  const leverageCost = totalCost / leverage;
  const capitalPercent = (totalCost / accountSize) * 100;

  return {
    riskAmount,
    stopLossPrice,
    riskPerShare,
    shares,
    totalCost,
    leverageCost,
    capitalPercent,
  };
}
