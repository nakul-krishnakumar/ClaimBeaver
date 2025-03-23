import json
import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.user import (
    InboundWebhook,
    InboundWebhookResponse,
    UserCreate,
    UserQueryResponse,
    UserResponse,
    UserQuery,
    UserUpdate,
    UserDetailsRequest,
    NameResponse,
    DetailsResponse,
)
from app.services.user_service import (
    get_user_by_id,
    get_user_by_phone,
    create_user,
    update_user,
    get_default_user,
    process_user_details,
)

router = APIRouter(tags=["users"])

logger = logging.getLogger("app")


@router.post("/get-name", response_model=NameResponse)
async def get_name(data: UserDetailsRequest, db: Session = Depends(get_db)):
    """
    Endpoint to get user name based on phone number.
    Returns flag=false if user not found.
    """
    args = process_user_details(data.model_dump())
    logger.info(args)
    logger.info(f"Processing get-name request: {json.dumps(args, indent=4)}")

    # Check if phone number is provided
    if args and args.get("phone_number"):
        phone_number = args["phone_number"]
        user = get_user_by_phone(db, phone_number)
        if user:
            return NameResponse(customer_name=user["name"], flag="true")

    # Return default response if no user found
    default_user = get_default_user()
    return NameResponse(
        customer_name=default_user["customer_name"], flag=default_user["flag"]
    )


@router.post("/set-details", response_model=DetailsResponse)
async def set_details(data: UserDetailsRequest, db: Session = Depends(get_db)):
    """
    Endpoint to set user details including name, phone number, DOB and insurance type.
    """
    args = process_user_details(data.model_dump())
    logger.info(f"Processing set-details request: {json.dumps(args, indent=4)}")

    # Extract user details
    name = args.get("name")
    phone_number = args.get("phoneNumber")
    dob = args.get("dob")
    insurance_type = args.get("insuranceType")

    if name and phone_number and dob and insurance_type:
        # Create new user
        user_data = UserCreate(
            name=name, phone_number=phone_number, dob=dob, insurance_type=insurance_type
        )
        new_user = create_user(db, user_data)
        logger.warning(f"New user created: {new_user}")

        if new_user:
            return DetailsResponse(flag="true")

    return DetailsResponse(flag="false")


@router.post("/get-query", response_model=UserQueryResponse)
async def get_query(data: UserQuery, db: Session = Depends(get_db)):
    """
    Endpoint to get user query response.
    """
    logger.info(f"Processing get-query request: {json.dumps(data.dict(), indent=4)}")

    # Extract user query
    customer_name = data.args.get("customer_name")
    query = data.args.get("query")

    if customer_name and query:
        return UserQueryResponse(
            response=f"Query received from {customer_name}: {query}"
        )

    return UserQueryResponse(response="Invalid query")


@router.post("/inbound-webhook")
async def inbound_webhook(webhook_data: InboundWebhook, db: Session = Depends(get_db)):
    """
    Endpoint to handle inbound call webhooks.
    Searches the database for the caller's information and returns appropriate response.
    """
    # Log the incoming webhook data
    logger.info(
        f"Received inbound webhook: {json.dumps(webhook_data.model_dump(), indent=4)}"
    )

    # Initialize response with empty values
    response = InboundWebhookResponse(call_inbound={})

    # Extract from_number from the webhook data
    from_number = webhook_data.call_inbound.get("from_number")

    if from_number:
        # Search for user in database using the from_number
        user = get_user_by_phone(db, from_number)

        if user:
            # User found, prepare dynamic variables with customer name
            response.call_inbound = {
                "dynamic_variables": {
                    "customer_name": user["name"],
                    "flag": "true",
                    "phone_number": from_number,
                },
            }
            logger.info(f"Found user for number {from_number}: {user['name']}")
        else:
            # User not found, use default user information
            default_user = get_default_user()
            response.call_inbound = {
                "dynamic_variables": {
                    "customer_name": default_user["customer_name"],
                    "flag": default_user["flag"],
                    "phone_number": from_number,
                },
            }
            logger.info(f"No user found for number {from_number}, using default")
    else:
        logger.warning("No from_number provided in webhook data")

    return response
