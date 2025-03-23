from fastapi import APIRouter, Depends, HTTPException, Request, Header
from typing import Dict, List, Any, Optional
import logging

from app.schemas.retell import (
    RetellCallRequest, 
    RetellCallResponse,
    RetellCallDetails,
    CustomLLMRequest,
    CustomLLMResponse,
    RetellWebhookEvent
)
from app.services.retell_service import RetellService

router = APIRouter(prefix="/retell", tags=["retell"])
logger = logging.getLogger(__name__)


def get_retell_service():
    return RetellService()


@router.post("/call", response_model=RetellCallResponse)
async def create_call(
    request: RetellCallRequest,
    retell_service: RetellService = Depends(get_retell_service)
):
    """
    Create a new outbound call using Retell
    """
    try:
        result = await retell_service.create_call(
            agent_id=request.agent_id,
            customer_number=request.customer_number,
            agent_number=request.agent_number,
            metadata=request.metadata
        )
        return result
    except Exception as e:
        logger.error(f"Error creating call: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create call: {str(e)}")


@router.get("/call/{call_id}", response_model=RetellCallDetails)
async def get_call(
    call_id: str,
    retell_service: RetellService = Depends(get_retell_service)
):
    """
    Get details about a specific call
    """
    try:
        result = await retell_service.get_call_details(call_id)
        return result
    except Exception as e:
        logger.error(f"Error getting call details: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get call details: {str(e)}")


@router.post("/call/{call_id}/end")
async def end_call(
    call_id: str,
    retell_service: RetellService = Depends(get_retell_service)
):
    """
    End an active call
    """
    try:
        result = await retell_service.end_call(call_id)
        return result
    except Exception as e:
        logger.error(f"Error ending call: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to end call: {str(e)}")


@router.get("/calls", response_model=List[RetellCallDetails])
async def list_calls(
    limit: int = 20,
    agent_id: Optional[str] = None,
    retell_service: RetellService = Depends(get_retell_service)
):
    """
    List recent calls, optionally filtered by agent_id
    """
    try:
        result = await retell_service.list_calls(limit=limit, agent_id=agent_id)
        return result
    except Exception as e:
        logger.error(f"Error listing calls: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to list calls: {str(e)}")


@router.post("/webhook", status_code=200)
async def webhook_handler(
    request: Request,
    x_retell_signature: Optional[str] = Header(None),
    retell_service: RetellService = Depends(get_retell_service)
):
    """
    Handle webhook events from Retell
    """
    body = await request.body()
    
    if x_retell_signature and not retell_service.verify_webhook_signature(x_retell_signature, body):
        raise HTTPException(status_code=401, detail="Invalid webhook signature")
    
    try:
        data = await request.json()
        event = RetellWebhookEvent(**data)
        
        logger.info(f"Received Retell webhook event: {event.event_type} for call {event.call_id}")
        
        # @TODO: Process the webhook event
        
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Error processing webhook: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to process webhook: {str(e)}")


@router.post("/custom-llm", response_model=CustomLLMResponse)
async def custom_llm_handler(
    request: CustomLLMRequest,
    retell_service: RetellService = Depends(get_retell_service)
):
    """
    Handle custom LLM requests from Retell
    This endpoint receives conversation data and returns LLM responses
    """
    try:
        #@TODO: Add call to nakul's LLM
        result = retell_service.process_custom_llm_request(request.dict())
        
        return CustomLLMResponse(
            response_text=result["response_text"],
            updated_conversation_state=result.get("updated_conversation_state")
        )
    except Exception as e:
        logger.error(f"Error processing custom LLM request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to process LLM request: {str(e)}")