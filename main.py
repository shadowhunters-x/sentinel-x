from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="SENTINEL-X")


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# MODELS
# ==========================================

class DeploymentRequest(BaseModel):
    application: str
    environment: str
    replicas: int


class SmartDeploymentRequest(BaseModel):
    application: str
    sensitive_data: bool
    internet_required: bool
    high_security: bool
    replicas: int


# ==========================================
# HOME
# ==========================================

@app.get("/")
def home():
    return {
        "message": "SENTINEL-X is running",
        "status": "online"
    }


# ==========================================
# HEALTH
# ==========================================

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# ==========================================
# BASIC DEPLOYMENT
# ==========================================

@app.post("/deploy")
def deploy(request: DeploymentRequest):

    environment = request.environment.lower()

    if environment == "cloud":

        strategy = "Deploy to cloud infrastructure"
        security = "Standard cloud security"

    elif environment == "on-prem":

        strategy = "Deploy to on-premises infrastructure"
        security = "Enterprise internal security"

    elif environment == "air-gapped":

        strategy = "Deploy to isolated air-gapped infrastructure"
        security = "Maximum isolation - no internet access"

    else:

        return {
            "status": "error",
            "message": "Unknown deployment environment"
        }

    return {
        "status": "deployment_planned",
        "application": request.application,
        "environment": environment,
        "replicas": request.replicas,
        "strategy": strategy,
        "security": security
    }


# ==========================================
# SMART DEPLOYMENT ENGINE
# ==========================================

@app.post("/smart-deploy")
def smart_deploy(request: SmartDeploymentRequest):

    factors = []

    # ==========================================
    # 1. REPLICA ANALYSIS
    # ==========================================

    if request.replicas == 1:

        availability_level = "BASIC"

        availability_message = (
            "Single replica - limited redundancy."
        )

        scaling_recommendation = (
            "Consider 2+ replicas for better availability."
        )

        availability_score = 1

    elif request.replicas == 2:

        availability_level = "REDUNDANT"

        availability_message = (
            "Two replicas provide basic redundancy."
        )

        scaling_recommendation = (
            "Suitable for standard workloads."
        )

        availability_score = 2

    elif request.replicas == 3:

        availability_level = "HIGH AVAILABILITY"

        availability_message = (
            "Three replicas provide strong service availability."
        )

        scaling_recommendation = (
            "Recommended for important production workloads."
        )

        availability_score = 3

    else:

        availability_level = "HIGH SCALE"

        availability_message = (
            "Multiple replicas provide increased capacity "
            "and resilience."
        )

        scaling_recommendation = (
            "Suitable for high-demand or scalable workloads."
        )

        availability_score = 4


    # ==========================================
    # 2. DEPLOYMENT DECISION
    # ==========================================

    if request.high_security and request.sensitive_data:

        environment = "air-gapped"

        reason = (
            "High security and sensitive data require "
            "maximum isolation."
        )

        security_level = "CRITICAL"

        risk_score = 92

        data_classification = "SENSITIVE"

        network_exposure = "ISOLATED"

        factors.append(
            "Sensitive data requires maximum protection."
        )

        factors.append(
            "High-security mode requires network isolation."
        )

        factors.append(
            "Air-gapped infrastructure prevents external connectivity."
        )

    elif request.sensitive_data:

        environment = "on-prem"

        reason = (
            "Sensitive data should remain within "
            "controlled infrastructure."
        )

        security_level = "HIGH"

        risk_score = 76

        data_classification = "SENSITIVE"

        network_exposure = "CONTROLLED"

        factors.append(
            "Sensitive data favors controlled infrastructure."
        )

        factors.append(
            "On-premises deployment keeps data within "
            "the organization's environment."
        )

    elif request.internet_required:

        environment = "cloud"

        reason = (
            "The application requires internet connectivity."
        )

        security_level = "STANDARD"

        risk_score = 48

        data_classification = "GENERAL"

        network_exposure = "INTERNET"

        factors.append(
            "Internet connectivity is required."
        )

        factors.append(
            "Cloud infrastructure provides external connectivity."
        )

    else:

        environment = "on-prem"

        reason = (
            "No internet requirement; controlled "
            "infrastructure is preferred."
        )

        security_level = "MODERATE"

        risk_score = 61

        data_classification = "GENERAL"

        network_exposure = "CONTROLLED"

        factors.append(
            "The application does not require internet access."
        )

        factors.append(
            "Controlled infrastructure reduces unnecessary exposure."
        )


    # ==========================================
    # 3. REPLICA FACTOR
    # ==========================================

    if request.replicas == 1:

        factors.append(
            "Single replica reduces redundancy."
        )

    elif request.replicas == 2:

        factors.append(
            "Two replicas provide basic redundancy."
        )

    elif request.replicas == 3:

        factors.append(
            "Three replicas provide high availability."
        )

    else:

        factors.append(
            "Multiple replicas increase capacity and resilience."
        )


    # ==========================================
    # 4. READINESS SCORE
    # ==========================================

    readiness_score = 100

    readiness_score -= int(risk_score * 0.25)


    if request.replicas == 1:

        readiness_score -= 15

    elif request.replicas == 2:

        readiness_score += 0

    elif request.replicas == 3:

        readiness_score += 5

    else:

        readiness_score += 8


    if request.sensitive_data and environment == "air-gapped":

        readiness_score += 8

    elif request.sensitive_data and environment == "on-prem":

        readiness_score += 5


    if request.internet_required and environment == "cloud":

        readiness_score += 5


    if request.high_security and environment == "air-gapped":

        readiness_score += 7


    readiness_score = max(
        0,
        min(100, readiness_score)
    )


    # ==========================================
    # 5. READINESS STATUS
    # ==========================================

    if readiness_score >= 85:

        readiness_status = "READY FOR DEPLOYMENT"

    elif readiness_score >= 70:

        readiness_status = "DEPLOYMENT READY"

    elif readiness_score >= 50:

        readiness_status = "REVIEW CONFIGURATION"

    else:

        readiness_status = "HIGH RISK CONFIGURATION"


    # ==========================================
    # 6. ENVIRONMENT CONFIDENCE
    # ==========================================

    if environment == "air-gapped":

        environment_confidence = 96

    elif environment == "on-prem":

        environment_confidence = 89

    else:

        environment_confidence = 94


    # ==========================================
    # 7. FINAL RESPONSE
    # ==========================================

    return {

        "status": "deployment_planned",

        "application": request.application,

        "recommended_environment": environment,

        "replicas": request.replicas,

        "reason": reason,

        "security_level": security_level,

        "risk_score": risk_score,

        "data_classification": data_classification,

        "network_exposure": network_exposure,

        "availability_level": availability_level,

        "availability_message": availability_message,

        "scaling_recommendation": scaling_recommendation,

        "readiness_score": readiness_score,

        "readiness_status": readiness_status,

        "availability_score": availability_score,

        "environment_confidence": environment_confidence,

        "decision_factors": factors,

        "decision_engine": "SENTINEL-X Autonomous Policy Engine"

    }