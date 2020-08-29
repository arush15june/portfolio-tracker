"""Router for handling portfolio CRUD operations. """

from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session

from db import schemas, crud, get_db

router = APIRouter()

PORTFOLIO_TAGS = ["portfolio"]

@router.get("/portfolio", tags=PORTFOLIO_TAGS)
async def get_portfolios(db: Session = Depends(get_db)):
    """Return list of all portfolios. """
    portfolios = crud.get_portfolios(db)
    return [
        schemas.Portfolio.from_orm(portfolio)
        for portfolio in portfolios
    ]

@router.post("/portfolio", tags=PORTFOLIO_TAGS)
async def new_portfolio(portfolio: schemas.PortfolioCreate, db: Session = Depends(get_db)):
    """Create new portfolio to store stock picks.
    """
    portfolio = crud.create_portfolio(db, portfolio)
    return schemas.Portfolio.from_orm(portfolio)

@router.get("/portfolio/{portfolio_id}", tags=PORTFOLIO_TAGS)
async def get_portfolio(portfolio_id: int, db: Session = Depends(get_db)):
    """Fetch a portfolio from database.
    """
    try:
        portfolio = crud.get_portfolio(db, portfolio_id)
    except crud.PortfolioNotFoundError as e:
        raise HTTPException(status_code=400, detail={"error": "Invalid portfolio ID.", "portfolio_id": e.portfolio_id})
    return schemas.PortfolioPicks.from_orm(portfolio)

@router.delete("/portfolio/{portfolio_id}", tags=PORTFOLIO_TAGS)
async def deactivate_portfolio(portfolio_id: int, db: Session = Depends(get_db)):
    """Fetch a portfolio from database.
    """
    portfolio = crud.deactivate_portfolio(db, portfolio_id)
    return schemas.PortfolioPicks.from_orm(portfolio)

@router.post("/portfolio/{portfolio_id}/pick", tags=PORTFOLIO_TAGS)
async def create_portfolio_pick(portfolio_id: int, pick: schemas.PickCreate, db: Session = Depends(get_db)):
    """Create new pick in portfolio.
    """
    try:
        portfolio = crud.create_portfolio_pick(db, portfolio_id, pick)
    except crud.PortfolioNotFoundError as e:
        raise HTTPException(status_code=400, detail={"error": "Invalid portfolio ID.", "portfolio_id": e.portfolio_id})
        
    return schemas.PortfolioPicks.from_orm(portfolio)

@router.delete("/portfolio/{portfolio_id}/pick/{pick_id}", tags=PORTFOLIO_TAGS)
async def create_portfolio_pick(portfolio_id: int, pick_id: int, db: Session = Depends(get_db)):
    """Delete a pick from a portfolio.
    """
    try:
        pick = crud.delete_portfolio_pick(db, portfolio_id, pick_id)
    except crud.PortfolioNotFoundError as e:
        raise HTTPException(status_code=400, detail={"error": "Invalid input.", "portfolio_id": e.portfolio_id})
    except crud.InvalidAllocationError as e:
        raise HTTPException(status_code=400, detail={"error": "Invalid allocation.", "allocation": e.allocation})
    except:
        raise HTTPException(status_code=400, detail={"error": "Error ocurred in creating pick."})
        
    return pick
