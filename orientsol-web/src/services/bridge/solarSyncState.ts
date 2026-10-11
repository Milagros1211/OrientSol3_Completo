/**
 * Shared Reactive State for Solar System Technical Parameters.
 * Synchronizes installed peak power (Potencia Pico kWp) and NOCT/TONC (°C)
 * bidirectionally between the Climate Simulation Bar and the Energy Calculation Panels.
 */

class SolarSyncStateService {
  private peakPowerKw: number = 5.0;
  private tonc: number = 47.0;
  private coefTemp: number = -0.0035;
  private performanceRatio: number = 0.80;

  constructor() {
    if (typeof window !== 'undefined') {
      // Re-read initial DOM values if already present
      window.addEventListener('DOMContentLoaded', () => {
        this.syncFromDom();
      });
    }
  }

  public syncFromDom(): void {
    if (typeof document === 'undefined') return;
    const simPeak = document.querySelector<HTMLInputElement>('#sim-peak-kw');
    if (simPeak && simPeak.value) {
      const v = parseFloat(simPeak.value);
      if (!isNaN(v) && v > 0) this.peakPowerKw = v;
    }
    const simTonc = document.querySelector<HTMLInputElement>('#sim-tonc');
    if (simTonc && simTonc.value) {
      const v = parseFloat(simTonc.value);
      if (!isNaN(v) && v > 0) this.tonc = v;
    }
  }

  public getPeakPowerKw(): number {
    return this.peakPowerKw;
  }

  public getTonc(): number {
    return this.tonc;
  }

  public getCoefTemp(): number {
    return this.coefTemp;
  }

  public getPerformanceRatio(): number {
    return this.performanceRatio;
  }

  public setPerformanceRatio(val: number, source: string = 'unknown'): void {
    if (isNaN(val) || val <= 0) return;
    this.performanceRatio = val;
    this.dispatchUpdate('performanceRatio', val, source);
  }

  public setPeakPowerKw(val: number, source: string = 'unknown'): void {
    if (isNaN(val) || val <= 0) return;
    if (this.peakPowerKw === val) {
      // Still ensure DOM inputs match
      this.updateDomInputs('peakPowerKw', val);
      return;
    }
    this.peakPowerKw = val;
    this.updateDomInputs('peakPowerKw', val);
    this.dispatchUpdate('peakPowerKw', val, source);
  }

  public setTonc(val: number, source: string = 'unknown'): void {
    if (isNaN(val) || val <= 0) return;
    if (this.tonc === val) {
      this.updateDomInputs('tonc', val);
      return;
    }
    this.tonc = val;
    this.updateDomInputs('tonc', val);
    this.dispatchUpdate('tonc', val, source);
  }

  public setCoefTemp(val: number, source: string = 'unknown'): void {
    if (isNaN(val)) return;
    this.coefTemp = val;
    this.dispatchUpdate('coefTemp', val, source);
  }

  private updateDomInputs(field: 'peakPowerKw' | 'tonc', val: number): void {
    if (typeof document === 'undefined') return;

    if (field === 'peakPowerKw') {
      const simInput = document.querySelector<HTMLInputElement>('#sim-peak-kw');
      if (simInput && parseFloat(simInput.value) !== val) {
        simInput.value = val.toString();
      }
      const energyInput = document.querySelector<HTMLInputElement>('#input-energy-potencia');
      if (energyInput && parseFloat(energyInput.value) !== val) {
        energyInput.value = val.toString();
      }
    } else if (field === 'tonc') {
      const simInput = document.querySelector<HTMLInputElement>('#sim-tonc');
      if (simInput && parseFloat(simInput.value) !== val) {
        simInput.value = val.toString();
      }
      const energyInput = document.querySelector<HTMLInputElement>('#input-energy-tonc');
      if (energyInput && parseFloat(energyInput.value) !== val) {
        energyInput.value = val.toString();
      }
    }
  }

  private dispatchUpdate(field: string, val: number, source: string): void {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(
      new CustomEvent('orientsol:solar-params-updated', {
        detail: {
          field,
          value: val,
          source,
          peakPowerKw: this.peakPowerKw,
          tonc: this.tonc,
          coefTemp: this.coefTemp,
        },
      })
    );
  }
}

export const solarSyncState = new SolarSyncStateService();
