import httpx
import logging
import json
import hmac
import hashlib
from typing import Dict, Any, Optional, List

from app.core.config import settings

logger = logging.getLogger(__name__)


class RetellService:
    """Service for interacting with Retell API"""
    
    def __init__(self):
        self.api_key = settings.RETELL_API_KEY
        self.base_url = settings.RETELL_API_URL
        self.webhook_secret = settings.RETELL_WEBHOOK_SECRET
        
    async def create_call(self, agent_id: str, customer_number: str, 
                    agent_number: Optional[str] = None, 
                    metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Create a new call using Retell API
        """
        url = f"{self.base_url}/call"
        
        payload = {
            "agent_id": agent_id,
            "customer_number": customer_number
        }
        
        if agent_number:
            payload["agent_number"] = agent_number
            
        if metadata:
            payload["metadata"] = metadata
            
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url,
                json=payload,
                headers={
                    "Content-Type": "application/json",
                    "x-api-key": self.api_key
                }
            )
            
        if response.status_code not in (200, 201):
            logger.error(f"Failed to create call: {response.text}")
            response.raise_for_status()
            
        return response.json()
    
    async def get_call_details(self, call_id: str) -> Dict[str, Any]:
        """
        Get details of a specific call
        """
        url = f"{self.base_url}/call/{call_id}"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                url,
                headers={
                    "Content-Type": "application/json",
                    "x-api-key": self.api_key
                }
            )
            
        if response.status_code != 200:
            logger.error(f"Failed to get call details: {response.text}")
            response.raise_for_status()
            
        return response.json()
    
    async def end_call(self, call_id: str) -> Dict[str, Any]:
        """
        End an active call
        """
        url = f"{self.base_url}/call/{call_id}/end"
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url,
                headers={
                    "Content-Type": "application/json",
                    "x-api-key": self.api_key
                }
            )
            
        if response.status_code != 200:
            logger.error(f"Failed to end call: {response.text}")
            response.raise_for_status()
            
        return response.json()
    
    async def list_calls(self, limit: int = 20, 
                          agent_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        List recent calls, optionally filtered by agent_id
        """
        url = f"{self.base_url}/calls"
        params = {"limit": limit}
        
        if agent_id:
            params["agent_id"] = agent_id
            
        async with httpx.AsyncClient() as client:
            response = await client.get(
                url,
                params=params,
                headers={
                    "Content-Type": "application/json",
                    "x-api-key": self.api_key
                }
            )
            
        if response.status_code != 200:
            logger.error(f"Failed to list calls: {response.text}")
            response.raise_for_status()
            
        return response.json()
    
    def process_custom_llm_request(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process a custom LLM request from Retell
        This is where you would integrate with your own LLM service
        """
        # Extract relevant information from the request
        call_id = request_data.get("call_id")
        conversation_state = request_data.get("conversation_state", {})
        transcript = request_data.get("transcript", [])
        user_message = request_data.get("user_message")
        
        # Log the request for debugging
        logger.info(f"Processing custom LLM request for call {call_id}")
        
        # Here you would typically:
        # 1. Process the transcript
        # 2. Generate a response using your LLM
        # 3. Update the conversation state

        gemini_input = {
            "transcript": transcript,
            "user_message": user_message,
            "conversation_state": conversation_state
        }
        
        # @TODO: Implement the call to nakul's LLM
        gemini_response = self.call_gemini_llm(gemini_input)

        response_text = gemini_response.get("response_text", "Random response go brrrrr....")
        updated_conversation_state = gemini_response.get("updated_conversation_state", conversation_state)
        
        response = {
            "response_text": response_text,
            "updated_conversation_state": updated_conversation_state
        }
        
        return response
    
    def verify_webhook_signature(self, signature: str, body: bytes) -> bool:
        """
        Verify that a webhook request is authentic by checking the signature
        """
        if not self.webhook_secret:
            logger.warning("Webhook secret not configured, skipping signature verification")
            return True
            
        computed_signature = hmac.new(
            self.webhook_secret.encode(),
            body,
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(computed_signature, signature)