from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    name: str
    phone_number: str
    dob: str
    insurance_type: str

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone_number: Optional[str] = None
    dob: Optional[str] = None
    insurance_type: Optional[str] = None

class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class UserDetailsRequest(BaseModel):
    args: Dict[str, Any] = Field(...)

class NameResponse(BaseModel):
    customer_name: str
    flag: str

class DetailsResponse(BaseModel):
    flag: str

class UserQuery(BaseModel):
    args: Dict[str, Any] = Field(...)

class UserQueryResponse(BaseModel):
    response: str

class InboundWebhookResponse(BaseModel):
    call_inbound: Dict[str, Dict[str, str]]

class InboundWebhook(BaseModel):
    event: str
    call_inbound: Dict[str, str]


