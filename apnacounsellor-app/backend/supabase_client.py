"""Supabase Client for Apna Counsellor App Backend"""
import os
import logging
from supabase import create_client, Client

logger = logging.getLogger(__name__)

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "") # Service role key usually for backend

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

async def supabase_query(table: str, query_params: dict = None) -> any:
    """Helper to query Supabase tables"""
    try:
        query = supabase.table(table).select("*")
        if query_params:
            for key, value in query_params.items():
                query = query.eq(key, value)
        
        result = query.execute()
        return result.data
    except Exception as e:
        logger.error(f"Supabase query error [{table}]: {e}")
        raise e

async def supabase_upsert(table: str, data: dict) -> any:
    """Helper to upsert into Supabase tables"""
    try:
        result = supabase.table(table).upsert(data).execute()
        return result.data
    except Exception as e:
        logger.error(f"Supabase upsert error [{table}]: {e}")
        raise e

def clean_user(user: dict) -> dict:
    """Remove sensitive fields and normalize fields"""
    if not user:
        return None
    u = dict(user)
    u.pop("passwordHash", None)
    u.pop("password_hash", None)
    # Supabase uses snake_case, so we might need to map some fields back to camelCase if frontend expects it
    # But it's better to update frontend to expect snake_case
    return u
