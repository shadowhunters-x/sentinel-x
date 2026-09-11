import { useState } from "react";
import "./App.css";

function App() {
  const [application, setApplication] = useState("Medical Records System");
  const [sensitiveData, setSensitiveData] = useState(false);
  const [internetRequired, setInternetRequired] = useState(true);
  const [highSecurity, setHighSecurity] = useState(false);
  const [replicas, setReplicas] = useState(2);

  const [result, setResult] = useState(null);
  const [deploymentStage, setDeploymentStage] = useState("idle");
  const [scenario, setScenario] = useState("custom");

  // Separate What-If simulation controls
  const [simSensitiveData, setSimSensitiveData] = useState(false);
  const [simInternetRequired, setSimInternetRequired] = useState(true);
  const [simHighSecurity, setSimHighSecurity] = useState(false);
  const [simReplicas, setSimReplicas] = useState(2);

  const [simulation, setSimulation] = useState(null);
  const [simulationLoading, setSimulationLoading] = useState(false);

  const scenarios = {
    public: {
      name: "Public Web Application",
      application: "Public Web Platform",
      sensitiveData: false,
      internetRequired: true,
      highSecurity: false,
      replicas: 3,
    },

    hospital: {
      name: "Hospital Medical Records",
      application: "Hospital Medical Records",
      sensitiveData: true,
      internetRequired: false,
      highSecurity: false,
      replicas: 3,
    },

    classified: {
      name: "Classified Defense System",
      application: "Classified Defense System",
      sensitiveData: true,
      internetRequired: false,
      highSecurity: true,
      replicas: 2,
    },
  };

  const loadScenario = (type) => {
    const selected = scenarios[type];

    setScenario(type);
    setApplication(selected.application);
    setSensitiveData(selected.sensitiveData);
    setInternetRequired(selected.internetRequired);
    setHighSecurity(selected.highSecurity);
    setReplicas(selected.replicas);

    // Start What-If with the same values as the selected scenario
    setSimSensitiveData(selected.sensitiveData);
    setSimInternetRequired(selected.internetRequired);
    setSimHighSecurity(selected.highSecurity);
    setSimReplicas(selected.replicas);

    setResult(null);
    setSimulation(null);
    setDeploymentStage("idle");
  };

  const analyzeDeployment = async () => {
    try {
      setDeploymentStage("analyzing");
      setSimulation(null);

      const response = await fetch(
        "http://127.0.0.1:8000/smart-deploy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            application,
            sensitive_data: sensitiveData,
            internet_required: internetRequired,
            high_security: highSecurity,
            replicas: Number(replicas),
          }),
        }
      );

      const data = await response.json();

      setResult(data);

      setTimeout(() => {
        setDeploymentStage("security");
      }, 700);

      setTimeout(() => {
        setDeploymentStage("routing");
      }, 1400);

      setTimeout(() => {
        setDeploymentStage("deployed");
      }, 2100);
    } catch (error) {
      setDeploymentStage("idle");

      setResult({
        status: "error",
        reason: "Could not connect to SENTINEL-X backend.",
      });
    }
  };

  const runSimulation = async () => {
    try {
      setSimulationLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/smart-deploy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            application,
            sensitive_data: simSensitiveData,
            internet_required: simInternetRequired,
            high_security: simHighSecurity,
            replicas: Number(simReplicas),
          }),
        }
      );

      const data = await response.json();

      setSimulation(data);
    } catch (error) {
      setSimulation({
        status: "error",
        reason: "Simulation could not connect to the backend.",
      });
    } finally {
      setSimulationLoading(false);
    }
  };

  const isSelected = (environment) =>
    result?.recommended_environment === environment;

  const getDecisionTitle = () => {
    if (!result) return "";

    if (result.recommended_environment === "air-gapped") {
      return "WHY AIR-GAPPED?";
    }

    if (result.recommended_environment === "on-prem") {
      return "WHY ON-PREM?";
    }

    if (result.recommended_environment === "cloud") {
      return "WHY CLOUD?";
    }

    return "WHY THIS DECISION?";
  };

  const getDecisionExplanation = () => {
    if (!result) return "";

    if (result.recommended_environment === "air-gapped") {
      return "Sensitive data combined with maximum security requirements makes complete network isolation the safest deployment choice.";
    }

    if (result.recommended_environment === "on-prem") {
      return "Sensitive data requires controlled infrastructure while avoiding the stronger isolation of an air-gapped environment.";
    }

    if (result.recommended_environment === "cloud") {
      return "The application requires internet connectivity, making cloud infrastructure the most suitable deployment environment.";
    }

    return result.reason;
  };

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <div>
          <div className="brand">
            SENTINEL-X
          </div>

          <div className="subtitle">
            HYBRID DEPLOYMENT ORCHESTRATOR
          </div>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          SYSTEM ONLINE
        </div>
      </header>

      <main className="dashboard">

        {/* HERO */}
        <section className="hero">
          <p className="eyebrow">
            SHADOW HUNTERS
          </p>

          <h1>
            Deploy smarter.
            <br />
            Protect everything.
          </h1>

          <p className="hero-text">
            SENTINEL-X evaluates your application's
            security, data, and connectivity needs
            to recommend the safest place to run it.
          </p>
        </section>

        {/* JUDGE SCENARIOS */}
        <section className="scenario-panel">

          <div className="panel-title">
            <span>DEMO</span>
            JUDGE SCENARIOS
          </div>

          <p className="scenario-description">
            Instantly demonstrate how SENTINEL-X
            adapts deployment strategy to different
            real-world environments.
          </p>

          <div className="scenario-grid">

            <button
              type="button"
              className={
                scenario === "public"
                  ? "scenario-card active"
                  : "scenario-card"
              }
              onClick={() => loadScenario("public")}
            >
              <span className="scenario-icon">
                ◉
              </span>

              <strong>
                PUBLIC WEB
              </strong>

              <small>
                Internet-facing application
              </small>
            </button>

            <button
              type="button"
              className={
                scenario === "hospital"
                  ? "scenario-card active"
                  : "scenario-card"
              }
              onClick={() => loadScenario("hospital")}
            >
              <span className="scenario-icon">
                ✚
              </span>

              <strong>
                HOSPITAL
              </strong>

              <small>
                Sensitive medical records
              </small>
            </button>

            <button
              type="button"
              className={
                scenario === "classified"
                  ? "scenario-card active"
                  : "scenario-card"
              }
              onClick={() => loadScenario("classified")}
            >
              <span className="scenario-icon">
                ◈
              </span>

              <strong>
                CLASSIFIED
              </strong>

              <small>
                Maximum security isolation
              </small>
            </button>

          </div>
        </section>

        {/* REQUIREMENTS */}
        <section className="panel">

          <div className="panel-title">
            <span>01</span>
            DEPLOYMENT REQUIREMENTS
          </div>

          <label>
            APPLICATION
          </label>

          <input
            value={application}
            onChange={(e) => setApplication(e.target.value)}
            placeholder="Enter application name"
          />

          <div className="options">

            <div className="option">

              <div className="option-text">
                <strong>
                  Sensitive Data
                </strong>

                <small>
                  Contains confidential or regulated
                  information
                </small>
              </div>

              <button
                type="button"
                className={
                  sensitiveData
                    ? "toggle active"
                    : "toggle"
                }
                onClick={() =>
                  setSensitiveData(!sensitiveData)
                }
              >
                <span></span>
              </button>

            </div>

            <div className="option">

              <div className="option-text">
                <strong>
                  Internet Required
                </strong>

                <small>
                  Application requires external
                  connectivity
                </small>
              </div>

              <button
                type="button"
                className={
                  internetRequired
                    ? "toggle active"
                    : "toggle"
                }
                onClick={() =>
                  setInternetRequired(!internetRequired)
                }
              >
                <span></span>
              </button>

            </div>

            <div className="option">

              <div className="option-text">
                <strong>
                  High Security
                </strong>

                <small>
                  Maximum security isolation required
                </small>
              </div>

              <button
                type="button"
                className={
                  highSecurity
                    ? "toggle active"
                    : "toggle"
                }
                onClick={() =>
                  setHighSecurity(!highSecurity)
                }
              >
                <span></span>
              </button>

            </div>

          </div>

          <label>
            REPLICAS
          </label>

          <select
            value={replicas}
            onChange={(e) =>
              setReplicas(Number(e.target.value))
            }
          >
            <option value={1}>1 Replica</option>
            <option value={2}>2 Replicas</option>
            <option value={3}>3 Replicas</option>
            <option value={4}>4 Replicas</option>
            <option value={5}>5 Replicas</option>
          </select>

          <button
            type="button"
            className="analyze-button"
            onClick={analyzeDeployment}
          >
            ANALYZE & DEPLOY

            <span>
              →
            </span>
          </button>

        </section>

        {/* RESULTS */}
        {result && (
          <>

            {/* DECISION */}
            <section className="result-panel">

              <div className="panel-title">
                <span>02</span>
                SENTINEL-X DECISION
              </div>

              {result.status === "error" ? (

                <div className="error">
                  {result.reason}
                </div>

              ) : (

                <>
                  <div className="decision">

                    <div className="decision-label">
                      RECOMMENDED ENVIRONMENT
                    </div>

                    <div className="environment">
                      {result.recommended_environment?.toUpperCase()}
                    </div>

                    <p>
                      {result.reason}
                    </p>

                  </div>

                  <div className="decision-explanation">

                    <div className="decision-explanation-title">
                      {getDecisionTitle()}
                    </div>

                    <p>
                      {getDecisionExplanation()}
                    </p>

                  </div>

                  <div className="metrics">

                    <div>
                      <span>
                        APPLICATION
                      </span>

                      <strong>
                        {result.application}
                      </strong>
                    </div>

                    <div>
                      <span>
                        REPLICAS
                      </span>

                      <strong>
                        {result.replicas}
                      </strong>
                    </div>

                    <div>
                      <span>
                        STATUS
                      </span>

                      <strong className="ready">
                        {deploymentStage === "deployed"
                          ? "DEPLOYED"
                          : "READY"}
                      </strong>
                    </div>

                  </div>
                </>
              )}

            </section>

            {result.status !== "error" && (
              <>

                {/* READINESS */}
                <section className="readiness-panel">

                  <div className="panel-title">
                    <span>03</span>
                    DEPLOYMENT READINESS
                  </div>

                  <div className="readiness-content">

                    <div className="readiness-score">

                      <div className="score-number">
                        {result.readiness_score}

                        <small>
                          /100
                        </small>
                      </div>

                      <div className="score-label">
                        {result.readiness_status}
                      </div>

                    </div>

                    <div className="readiness-bar-container">

                      <div className="readiness-bar">

                        <div
                          className="readiness-fill"
                          style={{
                            width:
                              result.readiness_score + "%",
                          }}
                        ></div>

                      </div>

                      <div className="readiness-scale">
                        <span>0</span>
                        <span>50</span>
                        <span>100</span>
                      </div>

                    </div>

                  </div>

                  <div className="readiness-description">
                    SENTINEL-X combines security,
                    availability, data protection,
                    and infrastructure requirements
                    to calculate deployment readiness.
                  </div>

                </section>

                {/* EXPLAINABLE DECISION */}
                <section className="explain-panel">

                  <div className="panel-title">
                    <span>AI</span>
                    DECISION EXPLANATION
                  </div>

                  <div className="factor-list">

                    {result.decision_factors?.map(
                      (factor, index) => (
                        <div
                          className="factor"
                          key={index}
                        >
                          <span className="factor-number">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <span>
                            {factor}
                          </span>
                        </div>
                      )
                    )}

                  </div>

                  <div className="confidence-box">

                    <div>
                      <span>
                        ENVIRONMENT CONFIDENCE
                      </span>

                      <strong>
                        {result.environment_confidence}%
                      </strong>
                    </div>

                    <div className="confidence-bar">

                      <div
                        style={{
                          width:
                            result.environment_confidence + "%",
                        }}
                      ></div>

                    </div>

                  </div>

                </section>

                {/* SECURITY */}
                <section className="security-panel">

                  <div className="panel-title">
                    <span>04</span>
                    SECURITY & RISK ANALYSIS
                  </div>

                  <div className="security-grid">

                    <div className="security-card">

                      <span>
                        SECURITY LEVEL
                      </span>

                      <strong>
                        {result.security_level}
                      </strong>

                    </div>

                    <div className="security-card">

                      <span>
                        RISK SCORE
                      </span>

                      <strong>
                        {result.risk_score}

                        <small>
                          /100
                        </small>
                      </strong>

                      <div className="risk-meter">

                        <div
                          className="risk-meter-fill"
                          style={{
                            width:
                              result.risk_score + "%",
                          }}
                        ></div>

                      </div>

                      <small className="risk-label">
                        {result.risk_score >= 80
                          ? "CRITICAL RISK"
                          : result.risk_score >= 60
                          ? "HIGH RISK"
                          : result.risk_score >= 40
                          ? "MODERATE RISK"
                          : "LOW RISK"}
                      </small>

                    </div>

                    <div className="security-card">

                      <span>
                        DATA CLASSIFICATION
                      </span>

                      <strong>
                        {result.data_classification}
                      </strong>

                    </div>

                    <div className="security-card">

                      <span>
                        NETWORK EXPOSURE
                      </span>

                      <strong>
                        {result.network_exposure}
                      </strong>

                    </div>

                  </div>

                  <div className="decision-engine">

                    <span>
                      DECISION ENGINE
                    </span>

                    <strong>
                      {result.decision_engine}
                    </strong>

                  </div>

                </section>

                {/* AVAILABILITY */}
                <section className="availability-panel">

                  <div className="panel-title">
                    <span>05</span>
                    AVAILABILITY & SCALING
                  </div>

                  <div className="availability-grid">

                    <div className="availability-card">

                      <span>
                        REPLICA CAPACITY
                      </span>

                      <strong>
                        {result.replicas}

                        <small>
                          {result.replicas === 1
                            ? " REPLICA"
                            : " REPLICAS"}
                        </small>
                      </strong>

                    </div>

                    <div className="availability-card">

                      <span>
                        AVAILABILITY LEVEL
                      </span>

                      <strong>
                        {result.availability_level}
                      </strong>

                    </div>

                  </div>

                  <div className="availability-message">

                    <div>
                      <span>
                        AVAILABILITY ANALYSIS
                      </span>

                      <p>
                        {result.availability_message}
                      </p>
                    </div>

                    <div>
                      <span>
                        SCALING RECOMMENDATION
                      </span>

                      <p>
                        {result.scaling_recommendation}
                      </p>
                    </div>

                  </div>

                </section>

                {/* WHAT-IF SIMULATION */}
                <section className="whatif-panel">

                  <div className="panel-title">
                    <span>SIM</span>
                    WHAT-IF SIMULATION
                  </div>

                  <div className="whatif-intro">
                    <div>
                      <h3>
                        Test an alternative deployment
                      </h3>

                      <p>
                        Change these settings to see how
                        SENTINEL-X would respond. Your
                        current deployment will not change.
                      </p>
                    </div>

                    <span className="simulation-badge">
                      SANDBOX MODE
                    </span>
                  </div>

                  <div className="whatif-controls">

                    <div className="whatif-control">

                      <div>
                        <strong>
                          Sensitive Data
                        </strong>

                        <small>
                          Confidential information
                        </small>
                      </div>

                      <button
                        type="button"
                        className={
                          simSensitiveData
                            ? "toggle active"
                            : "toggle"
                        }
                        onClick={() =>
                          setSimSensitiveData(!simSensitiveData)
                        }
                      >
                        <span></span>
                      </button>

                    </div>

                    <div className="whatif-control">

                      <div>
                        <strong>
                          Internet Required
                        </strong>

                        <small>
                          External connectivity
                        </small>
                      </div>

                      <button
                        type="button"
                        className={
                          simInternetRequired
                            ? "toggle active"
                            : "toggle"
                        }
                        onClick={() =>
                          setSimInternetRequired(
                            !simInternetRequired
                          )
                        }
                      >
                        <span></span>
                      </button>

                    </div>

                    <div className="whatif-control">

                      <div>
                        <strong>
                          High Security
                        </strong>

                        <small>
                          Maximum isolation
                        </small>
                      </div>

                      <button
                        type="button"
                        className={
                          simHighSecurity
                            ? "toggle active"
                            : "toggle"
                        }
                        onClick={() =>
                          setSimHighSecurity(!simHighSecurity)
                        }
                      >
                        <span></span>
                      </button>

                    </div>

                    <div className="whatif-control">

                      <div>
                        <strong>
                          Replicas
                        </strong>

                        <small>
                          Service redundancy
                        </small>
                      </div>

                      <select
                        value={simReplicas}
                        onChange={(e) =>
                          setSimReplicas(
                            Number(e.target.value)
                          )
                        }
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                      </select>

                    </div>

                  </div>

                  <button
                    type="button"
                    className="simulate-button"
                    onClick={runSimulation}
                    disabled={simulationLoading}
                  >
                    {simulationLoading
                      ? "SIMULATING..."
                      : "RUN WHAT-IF SIMULATION"}

                    <span>
                      →
                    </span>
                  </button>

                  {simulation &&
                    simulation.status !== "error" && (

                      <div className="simulation-result">

                        <div className="simulation-header">

                          <div>
                            <span>
                              SIMULATION RESULT
                            </span>

                            <strong>
                              NEW DEPLOYMENT PROJECTION
                            </strong>
                          </div>

                          <div className="simulation-live">
                            ● LIVE
                          </div>

                        </div>

                        <div className="simulation-grid">

                          <div className="simulation-card">
                            <span>
                              ENVIRONMENT
                            </span>

                            <strong>
                              {simulation.recommended_environment?.toUpperCase()}
                            </strong>
                          </div>

                          <div className="simulation-card">
                            <span>
                              RISK
                            </span>

                            <strong>
                              {simulation.risk_score}
                              <small>/100</small>
                            </strong>
                          </div>

                          <div className="simulation-card">
                            <span>
                              READINESS
                            </span>

                            <strong>
                              {simulation.readiness_score}
                              <small>/100</small>
                            </strong>
                          </div>

                          <div className="simulation-card">
                            <span>
                              AVAILABILITY
                            </span>

                            <strong>
                              {simulation.availability_level}
                            </strong>
                          </div>

                        </div>

                        <div className="simulation-comparison">

                          <div className="comparison-column">
                            <span>
                              CURRENT DEPLOYMENT
                            </span>

                            <strong>
                              {result?.recommended_environment?.toUpperCase()}
                            </strong>

                            <small>
                              Readiness {result?.readiness_score}/100
                            </small>
                          </div>

                          <div className="comparison-arrow">
                            →
                          </div>

                          <div className="comparison-column simulated">
                            <span>
                              SIMULATED DEPLOYMENT
                            </span>

                            <strong>
                              {simulation.recommended_environment?.toUpperCase()}
                            </strong>

                            <small>
                              Readiness {simulation.readiness_score}/100
                            </small>
                          </div>

                        </div>

                        <div className="simulation-reason">

                          <span>
                            SENTINEL-X RESPONSE
                          </span>

                          <p>
                            {simulation.reason}
                          </p>

                        </div>

                      </div>
                    )}

                  {simulation &&
                    simulation.status === "error" && (

                      <div className="error">
                        {simulation.reason}
                      </div>

                    )}

                </section>

                {/* ARCHITECTURE */}
                <section className="architecture-panel">

                  <div className="panel-title">
                    <span>06</span>
                    DEPLOYMENT ARCHITECTURE
                  </div>

                  <div className="architecture">

                    <div className="architecture-node application-node">

                      <div className="node-icon">
                        ◆
                      </div>

                      <strong>
                        {result.application}
                      </strong>

                      <span>
                        APPLICATION
                      </span>

                    </div>

                    <div className="architecture-line">

                      <span>
                        ANALYZE
                      </span>

                      <div></div>

                    </div>

                    <div className="architecture-node sentinel-node">

                      <div className="node-icon">
                        ✦
                      </div>

                      <strong>
                        SENTINEL-X
                      </strong>

                      <span>
                        DECISION ENGINE
                      </span>

                    </div>

                    <div className="architecture-line">

                      <span>
                        ROUTE
                      </span>

                      <div></div>

                    </div>

                    <div
                      className={
                        isSelected("cloud")
                          ? "architecture-node environment-node selected"
                          : "architecture-node environment-node"
                      }
                    >

                      <div className="node-icon">
                        ☁
                      </div>

                      <strong>
                        CLOUD
                      </strong>

                      <span>
                        INTERNET ENABLED
                      </span>

                      {isSelected("cloud") && (
                        <b className="selected-label">
                          SELECTED
                        </b>
                      )}

                    </div>

                    <div
                      className={
                        isSelected("on-prem")
                          ? "architecture-node environment-node selected"
                          : "architecture-node environment-node"
                      }
                    >

                      <div className="node-icon">
                        ▣
                      </div>

                      <strong>
                        ON-PREM
                      </strong>

                      <span>
                        CONTROLLED NETWORK
                      </span>

                      {isSelected("on-prem") && (
                        <b className="selected-label">
                          SELECTED
                        </b>
                      )}

                    </div>

                    <div
                      className={
                        isSelected("air-gapped")
                          ? "architecture-node environment-node selected"
                          : "architecture-node environment-node"
                      }
                    >

                      <div className="node-icon">
                        ◈
                      </div>

                      <strong>
                        AIR-GAPPED
                      </strong>

                      <span>
                        MAXIMUM ISOLATION
                      </span>

                      {isSelected("air-gapped") && (
                        <b className="selected-label">
                          SELECTED
                        </b>
                      )}

                    </div>

                  </div>

                </section>

                {/* DEPLOYMENT STATUS */}
                <section className="deployment-panel">

                  <div className="panel-title">
                    <span>07</span>
                    DEPLOYMENT STATUS
                  </div>

                  <div className="deployment-steps">

                    <div
                      className={
                        deploymentStage !== "idle"
                          ? "deployment-step active"
                          : "deployment-step"
                      }
                    >
                      <span>01</span>
                      <strong>ANALYZING</strong>
                    </div>

                    <div
                      className={
                        deploymentStage === "security" ||
                        deploymentStage === "routing" ||
                        deploymentStage === "deployed"
                          ? "deployment-step active"
                          : "deployment-step"
                      }
                    >
                      <span>02</span>
                      <strong>SECURITY CHECK</strong>
                    </div>

                    <div
                      className={
                        deploymentStage === "routing" ||
                        deploymentStage === "deployed"
                          ? "deployment-step active"
                          : "deployment-step"
                      }
                    >
                      <span>03</span>
                      <strong>ROUTING</strong>
                    </div>

                    <div
                      className={
                        deploymentStage === "deployed"
                          ? "deployment-step active"
                          : "deployment-step"
                      }
                    >
                      <span>04</span>
                      <strong>DEPLOYED</strong>
                    </div>

                  </div>

                  <div className="deployment-message">

                    {deploymentStage === "analyzing" &&
                      "Evaluating application requirements..."}

                    {deploymentStage === "security" &&
                      "Checking security and data protection policies..."}

                    {deploymentStage === "routing" &&
                      "Routing application to " +
                        result.recommended_environment.toUpperCase() +
                        " environment..."}

                    {deploymentStage === "deployed" &&
                      "Deployment complete. " +
                        result.application +
                        " is ready in the " +
                        result.recommended_environment.toUpperCase() +
                        " environment."}

                  </div>

                </section>

              </>
            )}

          </>
        )}

      </main>
    </div>
  );
}

export default App;