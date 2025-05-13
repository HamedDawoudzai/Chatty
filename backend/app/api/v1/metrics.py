from fastapi import APIRouter

router = APIRouter(prefix="/metrics-info", tags=["metrics"])


@router.get("")
def metrics_info():
    return {"info": "Prometheus metrics available at /metrics"}
