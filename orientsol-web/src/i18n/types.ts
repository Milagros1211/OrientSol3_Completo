export type SupportedLocale = 'es' | 'en';

export interface Translations {
  common: {
    appName: string;
    versionBadge: string;
    subtitle: string;
    docs: string;
    loading: string;
    close: string;
    save: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    monthNamesShort: string[];
    monthNamesFull: string[];
  };
  header: {
    statusIdle: string;
    statusLoading: string;
    statusReady: string;
    statusError: string;
    langSelect: string;
    toggleSpanish: string;
    toggleEnglish: string;
  };
  hero: {
    title: string;
    description: string;
    statMatlab: string;
    statWasm: string;
    statPlatform: string;
  };
  location: {
    title: string;
    subtitle: string;
    selectLabel: string;
    albedoLabel: string;
    albedoDesc: string;
    latitude: string;
    longitude: string;
    elevation: string;
    dataSource: string;
  };
  externalClimate: {
    title: string;
    subtitle: string;
    sourceLabel: string;
    fetchBtn: string;
    calcBtn: string;
    calculating: string;
    annualGdm0: string;
    annualTemp: string;
    previewTitle: string;
  };
  hybridLoader: {
    title: string;
    subtitle: string;
    tabHistorical: string;
    tabManual: string;
    tabUpload: string;
    historicalLabel: string;
    selectStation: string;
    manualPresetLabel: string;
    manualPresetPlaceholder: string;
    loadTemplate: string;
    locName: string;
    country: string;
    applyManualBtn: string;
    dropzoneTitle: string;
    dropzoneHint: string;
    selectFileBtn: string;
    sampleCsvBtn: string;
    sampleJsonBtn: string;
    peakPowerLabel: string;
    prLabel: string;
    albedoLabel: string;
    toncLabel: string;
    runSimulationBtn: string;
    runningSimulationBtn: string;
  };
  results: {
    pythonSuccess: string;
    resultsFor: string;
    // Temperatures
    tempMeanAnnual: string;
    tempMeanAnnualDesc: string;
    tempMaxAnnual: string;
    tempMaxAnnualDesc: string;
    tempMinAnnual: string;
    tempMinAnnualDesc: string;
    tempCellOperating: string;
    tempCellOperatingDesc: string;
    // Optimal Annual
    optAnnualTitle: string;
    gainOverHoriz: string;
    annualTotalRad: string;
    optAnnualStudyTitle: string;
    optAnnualStudyDesc: string;
    selectComponent: string;
    compGlobal: string;
    compBeam: string;
    compDiffuse: string;
    compAlbedo: string;
    selectOtherAngleBtn: string;
    compareWithAngleX: string;
    angleRangeNotice: string;
    viewChartsBtn: string;
    energyCalcBtn: string;
    exportExcelBtn: string;
    generateReportBtn: string;
    monthlyRadSubtitle: string;
    radGlobal: string;
    radBeam: string;
    radDiffuse: string;
    radAlbedo: string;
    monthCol: string;
    annualMeanRow: string;
    tempMeanCol: string;
    gainHeader: string;
    gainFactorSub: string;
    gainPctSub: string;
    optimalColHeader: string;
    angleXColHeader: string;
    compSummaryTitle: string;
    compSummaryOptimalFound: string;
    compSummaryAngleX: string;
    compGainNet: string;
    compEqualMessage: string;
    compBetterMessage: string;
    compWorseMessage: string;
    comparisonModeToggle: string;
    standardView: string;
    comparisonView: string;
    // 4 Seasons
    seasonalTitle: string;
    vsFixed: string;
    winter: string;
    spring: string;
    summer: string;
    autumn: string;
    // 12 Months
    monthlyTitle: string;
    monthlyDailyMean: string;
    vsFixedAnnual: string;
    vsHorizontal: string;
    // Energy Balance
    energyBalanceTitle: string;
    solarReceivedTitle: string;
    collectorArea: string;
    annualIrradiationM2: string;
    dailyMeanResource: string;
    solarProducedTitle: string;
    osterwaldModel: string;
    cellThermalLosses: string;
    simplifiedModel: string;
    // Capture Loss Maps
    lossMapTitle: string;
    lossMapSubtitle: string;
    lossMapOptimal: string;
    cteGeneral: string;
    cteSuperposition: string;
    cteIntegration: string;
    cteNonCompliant: string;
    ofMap: string;
    tiltHeader: string;
    azimuthHeader: string;
    // 8 Surfaces Comparison
    surfacesTableTitle: string;
    surfacesTableSubtitle: string;
    thSurface: string;
    thType: string;
    thDailyRad: string;
    thAnnualTotal: string;
    thGainHoriz: string;
    thGainFixedOpt: string;
    thProdOsterwald: string;
    thCellTemp: string;
    // Charts & Visualizations
    chartsTitle: string;
    chartRadiationTitle: string;
    chartRadiationDesc: string;
    chartEnergyTitle: string;
    chartEnergyDesc: string;
    chartRankingTitle: string;
    chartRankingDesc: string;
    legendHorizontal: string;
    legendFixedOpt: string;
    legendMonthlyOpt: string;
    legendEnergyProd: string;
    legendAmbTemp: string;
    legendCellTemp: string;
    // Inclinación Óptima Anual Charts (MATLAB Grafica_Inclinaciones & Grafica_OptAnual)
    chartEvolutionTab: string;
    chartMonthlyTab: string;
    chartHowVariesQuestion: string;
    chartEnableGrid: string;
    chartEvolutionTitle: string;
    chartAxisTilt: string;
    chartAxisRadiation: string;
    chartAxisMonths: string;
    chartMonthlyRadiationTitle: string;
    chartGainsTitle: string;
    chartMinLabel: string;
    chartMedLabel: string;
    chartMaxLabel: string;
    chartToggleChartsBtn: string;
    compAll: string;
    saveChartLocalBtn: string;
    saveChartSuccess: string;
    chartBackBtn: string;
    // Albedo Warning (MATLAB Figura 5.2.48)
    albedoWarningTitle: string;
    albedoWarningMessage: string;
    // Excel Export Modal (MATLAB Figura 5.2.65)
    excelModalTitle: string;
    excelModalQuestion: string;
    excelOptionSingle: string;
    excelOptionAll: string;
    excelExportSuccess: string;
    // Export Actions
    exportActionsTitle: string;
    exportPdfBtn: string;
    exportCsvBtn: string;
    exportCopyBtn: string;
    exportCopied: string;
  };
  console: {
    title: string;
    subtitle: string;
    runScriptBtn: string;
    running: string;
    clearBtn: string;
    statusReady: string;
  };
  architecture: {
    title: string;
    subtitle: string;
  };
  statusBar: {
    ready: string;
    offlineMode: string;
    crossPlatform: string;
  };
}
