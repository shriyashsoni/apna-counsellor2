"""Convex HTTP API client for FastAPI backend"""
import httpx
import os
import logging

logger = logging.getLogger(__name__)

CONVEX_URL = os.environ.get("CONVEX_URL", "")
CONVEX_DEPLOY_KEY = os.environ.get("CONVEX_DEPLOY_KEY", "")


async def convex_query(path: str, args: dict = None) -> any:
    if args is None:
        args = {}
    # Convex optional fields don't accept null — strip None values
    args = {k: v for k, v in args.items() if v is not None}
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            f"{CONVEX_URL}/api/query",
            json={"path": path, "args": args, "format": "json"},
            headers={"Authorization": f"Convex {CONVEX_DEPLOY_KEY}"},
        )
        data = resp.json()
        if data.get("status") == "success":
            return data["value"]
        error = data.get("errorMessage", f"Convex query error (HTTP {resp.status_code})")
        logger.error(f"Convex query [{path}]: {error}")
        raise Exception(error)


async def convex_mutation(path: str, args: dict = None) -> any:
    if args is None:
        args = {}
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            f"{CONVEX_URL}/api/mutation",
            json={"path": path, "args": args, "format": "json"},
            headers={"Authorization": f"Convex {CONVEX_DEPLOY_KEY}"},
        )
        data = resp.json()
        if data.get("status") == "success":
            return data["value"]
        error = data.get("errorMessage", f"Convex mutation error (HTTP {resp.status_code})")
        logger.error(f"Convex mutation [{path}]: {error}")
        raise Exception(error)


def clean_user(user: dict) -> dict:
    """Remove password hash and normalize _id to id"""
    if not user:
        return None
    u = dict(user)
    u.pop("passwordHash", None)
    u.pop("password_hash", None)
    if "_id" in u and "id" not in u:
        u["id"] = u["_id"]
    return u
