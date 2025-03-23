from typing import Dict, List, Optional, Any, Union
from pydantic import BaseModel, Field
from datetime import datetime


class RetellCallRequest(BaseModel):
    """Schema for initiating a new Retell call"""
    agent_id: str
    customer_number: str
    agent_number: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class RetellCallResponse(BaseModel):
    """Schema for Retell call response"""
    call_id: str
    status: str
    created_at: datetime


class RetellCallDetails(BaseModel):
    """Schema for detailed call information"""
    call_id: str
    agent_id: str
    status: str
    customer_number: str
    agent_number: Optional[str]
    started_at: Optional[datetime]
    ended_at: Optional[datetime]
    duration: Optional[int]
    metadata: Optional[Dict[str, Any]]


class LLMResponse(BaseModel):
    """Schema for LLM response in a call"""
    response_text: str
    tokens_used: Optional[int]
    processing_time: Optional[float]


class RetellWebhookEvent(BaseModel):
    """Schema for Retell webhook events"""
    event_type: str = Field(..., description="Type of event from Retell")
    call_id: str = Field(..., description="The unique identifier of the call")
    timestamp: datetime = Field(..., description="When the event occurred")
    data: Dict[str, Any] = Field(..., description="Event specific data")


class CustomLLMRequest(BaseModel):
    """Schema for custom LLM input from Retell"""
    call_id: str
    conversation_state: Dict[str, Any]
    transcript: List[Dict[str, Any]]
    llm_response_format: Dict[str, Any]
    user_message: Optional[str] = None


class CustomLLMResponse(BaseModel):
    """Schema for response to Retell for custom LLM integration"""
    response_text: str
    updated_conversation_state: Optional[Dict[str, Any]] = None