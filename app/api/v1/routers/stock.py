"""Router for handling stock fetching operations. """

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db import schemas, crud, get_db

router = APIRouter()

STOCK_TAGS = ["stock"]

@router.get("/stock/{symbol}", tags=STOCK_TAGS)
async def get_stock(symbol: str, db: Session = Depends(get_db)):
    try:
        stock = crud.get_stock(db, symbol)
    except crud.SymbolNotFoundError as e:
        raise HTTPException(status_code=400, detail={"error": "Symbol not found", "symbol": e.symbol})
    return schemas.Stock.from_orm(stock)

