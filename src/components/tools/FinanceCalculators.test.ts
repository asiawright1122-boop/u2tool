import { describe, it, expect } from 'vitest';

// 1. Stock Profit Calculator logic
function calculateStockProfit(bp: number, sp: number, qty: number, bf: number, sf: number) {
  const costBasis = bp * qty + bf;
  const proceeds  = sp * qty - sf;
  const profit    = proceeds - costBasis;
  const roi       = costBasis > 0 ? (profit / costBasis) * 100 : 0;
  const totalFees = bf + sf;
  const breakEven = qty > 0 ? (costBasis + sf) / qty : 0;
  const isGain    = profit >= 0;
  return { costBasis, proceeds, profit, roi, totalFees, breakEven, isGain };
}

// 2. CAGR Calculator logic
function calculateCagr(sv: number, ev: number, yr: number) {
  if (sv <= 0 || ev <= 0 || yr <= 0) return null;
  const cagr        = (Math.pow(ev / sv, 1 / yr) - 1) * 100;
  const totalReturn = ((ev - sv) / sv) * 100;
  const annualGain  = (ev - sv) / yr;
  return { cagr, totalReturn, annualGain };
}

// 3. PayPal Fee Calculator logic
function calculatePaypalFee(amt: number, rPct: number, fixed: number, mode: 'toReceive' | 'toSend') {
  if (amt <= 0) return null;
  if (mode === 'toReceive') {
    const divider = 1 - rPct;
    const amountToSend = divider > 0 ? (amt + fixed) / divider : 0;
    const totalFees = amountToSend - amt;
    return { totalFees, netAmount: amt, amountToSend };
  } else {
    const totalFees = amt * rPct + fixed;
    const netAmount = Math.max(0, amt - totalFees);
    return { totalFees, netAmount, amountToSend: amt };
  }
}

// 4. Etsy Fee Calculator logic
function calculateEtsyFee(pr: number, sIn: number, co: number, sOut: number, listFee: number, transPct: number, procPct: number, procFixed: number, adsPct: number) {
  const revenue = pr + sIn;
  const tFee = revenue * transPct;
  const pFee = revenue * procPct + procFixed;
  const aFee = revenue * adsPct;
  const totalEtsyFees = listFee + tFee + pFee + aFee;
  const totalCostOfProduct = co + sOut;
  const totalExpenses = totalEtsyFees + totalCostOfProduct;
  const netProfit = revenue - totalExpenses;
  const margin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
  const roi = totalExpenses > 0 ? (netProfit / totalExpenses) * 100 : 0;
  return { revenue, totalEtsyFees, netProfit, margin, roi };
}

// 5. Freelance Rate Calculator logic
function calculateFreelanceRate(netGoal: number, exp: number, taxPct: number, wk: number, hr: number, dy: number) {
  const divider = 1 - taxPct;
  const grossTarget = divider > 0 ? (netGoal + exp) / divider : netGoal + exp;
  const totalTaxes = grossTarget - netGoal - exp;
  const totalHoursYearly = wk * hr;
  const requiredHourly = totalHoursYearly > 0 ? grossTarget / totalHoursYearly : 0;
  const hoursPerDay = dy > 0 ? hr / dy : 0;
  const requiredDaily = requiredHourly * hoursPerDay;
  return { grossTarget, totalTaxes, requiredHourly, requiredDaily };
}

// 6. Savings Goal Calculator logic
function calculateSavingsGoal(tgt: number, init: number, apr: number, mode: 'modeMonthly' | 'modeDuration', timeMonths: number, monthlyDeposit: number) {
  const aprFraction = apr / 100;
  const rMonthly = aprFraction / 12;
  if (tgt <= init || tgt <= 0) return null;

  if (mode === 'modeMonthly') {
    let monthlyRequired = 0;
    if (Math.abs(rMonthly) < 1e-9) {
      monthlyRequired = (tgt - init) / timeMonths;
    } else {
      const compoundFactor = Math.pow(1 + rMonthly, timeMonths);
      const annuityFactor = (Math.pow(1 + rMonthly, timeMonths) - 1) / rMonthly;
      monthlyRequired = (tgt - init * compoundFactor) / annuityFactor;
    }
    const totalSaved = init + monthlyRequired * timeMonths;
    const totalInterest = tgt - totalSaved;
    return { monthlyDeposit: monthlyRequired, totalSaved, totalInterest };
  } else {
    let n = 0;
    if (Math.abs(rMonthly) < 1e-9) {
      n = (tgt - init) / monthlyDeposit;
    } else {
      const numerator = tgt + monthlyDeposit / rMonthly;
      const denominator = init + monthlyDeposit / rMonthly;
      n = Math.log(numerator / denominator) / Math.log(1 + rMonthly);
    }
    const nRounded = Math.ceil(n);
    const totalSaved = init + monthlyDeposit * nRounded;
    return { duration: nRounded, totalSaved };
  }
}

// 7. Debt Snowball Calculator logic
interface DebtItem {
  id: string;
  name: string;
  balance: number;
  rate: number;
  min: number;
  monthlyInterest: number;
}
function calculateDebtSnowball(debtsList: DebtItem[], extra: number, strategy: 'snowball' | 'avalanche') {
  let workingDebts = debtsList.map(d => ({ ...d }));
  let months = 0;
  let accumulatedInterest = 0;
  
  const sortDebts = () => {
    if (strategy === 'snowball') {
      workingDebts.sort((a, b) => a.balance - b.balance);
    } else {
      workingDebts.sort((a, b) => b.rate - a.rate);
    }
  };

  const totalMinPay = workingDebts.reduce((sum, d) => sum + d.min, 0);
  const totalMonthlyBudget = totalMinPay + extra;

  while (workingDebts.some(d => d.balance > 0) && months < 600) {
    months++;
    sortDebts();

    let monthlyInterestCharges = 0;
    for (const d of workingDebts) {
      if (d.balance > 0) {
        const interest = d.balance * d.monthlyInterest;
        d.balance += interest;
        accumulatedInterest += interest;
        monthlyInterestCharges += interest;
      }
    }

    if (monthlyInterestCharges >= totalMonthlyBudget) {
      return { infinite: true };
    }

    let extraPool = extra;
    for (const d of workingDebts) {
      if (d.balance > 0) {
        const minPay = Math.min(d.balance, d.min);
        d.balance -= minPay;
        if (d.balance === 0) {
          extraPool += (d.min - minPay);
        }
      }
    }

    if (extraPool > 0) {
      for (const d of workingDebts) {
        if (d.balance > 0) {
          const pay = Math.min(d.balance, extraPool);
          d.balance -= pay;
          extraPool -= pay;
        }
      }
    }
  }

  return { infinite: false, months, totalInterest: accumulatedInterest };
}

describe('Cluster A - Finance Calculators Mathematical Integrity', () => {
  it('should calculate stock trade profit correctly', () => {
    const res = calculateStockProfit(50, 75, 100, 10, 10);
    expect(res.costBasis).toBe(5010);
    expect(res.proceeds).toBe(7490);
    expect(res.profit).toBe(2480);
    expect(res.roi).toBeCloseTo(49.50, 1);
    expect(res.totalFees).toBe(20);
    expect(res.breakEven).toBe(50.20);
    expect(res.isGain).toBe(true);
  });

  it('should calculate compound annual growth rate (CAGR) correctly', () => {
    const res = calculateCagr(10000, 25000, 7);
    expect(res).not.toBeNull();
    if (res) {
      expect(res.cagr).toBeCloseTo(13.98, 1);
      expect(res.totalReturn).toBe(150);
      expect(res.annualGain).toBeCloseTo(2142.86, 1);
    }
  });

  it('should calculate PayPal transaction fees correctly in both directions', () => {
    const toRec = calculatePaypalFee(100, 0.0299, 0.49, 'toReceive');
    expect(toRec).not.toBeNull();
    if (toRec) {
      expect(toRec.amountToSend).toBeCloseTo(103.59, 1);
      expect(toRec.totalFees).toBeCloseTo(3.59, 1);
    }

    const toSend = calculatePaypalFee(100, 0.0299, 0.49, 'toSend');
    expect(toSend).not.toBeNull();
    if (toSend) {
      expect(toSend.netAmount).toBeCloseTo(96.52, 1);
      expect(toSend.totalFees).toBeCloseTo(3.48, 1);
    }
  });

  it('should calculate Etsy fees, net profit and ROI correctly', () => {
    // price=25, shippingIn=5, cost=8, shippingOut=6, listingFee=0.20, transaction=6.5%, processing=3%+0.25, ads=0%
    const res = calculateEtsyFee(25, 5, 8, 6, 0.20, 0.065, 0.03, 0.25, 0);
    expect(res.revenue).toBe(30);
    expect(res.totalEtsyFees).toBeCloseTo(0.20 + 30 * 0.065 + (30 * 0.03 + 0.25), 2);
    expect(res.netProfit).toBeLessThan(16);
    expect(res.roi).toBeGreaterThan(0);
  });

  it('should calculate required freelance hourly and daily rates correctly', () => {
    // netGoal=50000, exp=6000, taxRate=20%, weeks=48, hours=25, dy=5
    const res = calculateFreelanceRate(50000, 6000, 0.20, 48, 25, 5);
    expect(res.grossTarget).toBe(70000);
    expect(res.totalTaxes).toBe(14000);
    expect(res.requiredHourly).toBeCloseTo(58.33, 1);
    expect(res.requiredDaily).toBeCloseTo(291.67, 1);
  });

  it('should calculate savings goals monthly payments and durations correctly', () => {
    // Target 10000 from 1000 at 4.5% APY in 36 months
    const monthly = calculateSavingsGoal(10000, 1000, 4.5, 'modeMonthly', 36, 0);
    expect(monthly).not.toBeNull();
    if (monthly) {
      expect(monthly.monthlyDeposit).toBeCloseTo(230.22, 1);
    }

    // Target 10000 from 1000 at 4.5% APY saving 250 monthly
    const duration = calculateSavingsGoal(10000, 1000, 4.5, 'modeDuration', 0, 250);
    expect(duration).not.toBeNull();
    if (duration) {
      expect(duration.duration).toBe(34);
    }
  });

  it('should calculate debt payoff months and interest correctly', () => {
    const debts: DebtItem[] = [
      { id: '1', name: 'Card A', balance: 3000, rate: 18, min: 90, monthlyInterest: 0.18 / 12 },
      { id: '2', name: 'Car Loan', balance: 8000, rate: 8, min: 200, monthlyInterest: 0.08 / 12 }
    ];
    const res = calculateDebtSnowball(debts, 200, 'snowball');
    expect(res.infinite).toBe(false);
    expect(res.months).toBeLessThan(30);
    expect(res.totalInterest).toBeGreaterThan(0);
  });
});
