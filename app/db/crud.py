from typing import List

from dataclasses import dataclass
from sqlalchemy.orm import Session
from sqlalchemy import desc

from stocks.helper import StockHelper, StockFetchError 
from . import models, schemas


def get_portfolio(db: Session, portfolio_id: int) -> models.Portfolio:
    return db.query(models.Portfolio).filter(models.Portfolio.id == portfolio_id).first()

def get_portfolios(db: Session, skip: int = 0, limit: int = 100) -> List[models.Portfolio]:
    return db.query(models.Portfolio).order_by(desc(models.Portfolio.created_on)    ).offset(skip).limit(limit).all()

class CreatePortfolioCommitError(Exception):
    pass

def create_portfolio(db: Session, portfolio: schemas.PortfolioCreate) -> models.Portfolio:
    db_portfolio = models.Portfolio(
        name=portfolio.name,
        description=portfolio.description
    )
    db.add(db_portfolio)

    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise CreatePortfolioCommitError(e)

    db.refresh(db_portfolio)
    return db_portfolio

def update_portfolio(db: Session, portfolio: schemas.Portfolio):
    pass

@dataclass
class SymbolNotFoundError(Exception):
    symbol: str

class GetStockCommitError(Exception):
    pass

def get_stock_or_none(db: Session, symbol: str) -> models.Stock:
    return db.query(models.Stock).get(symbol)

def get_stock(db: Session, symbol: str) -> models.Stock:
    db_stock = get_stock_or_none(db, symbol)
    if not db_stock:
        try:
            db_stock = StockHelper.get_stock(symbol)
            db.add(db_stock)
        except StockFetchError as e:
            raise SymbolNotFoundError(symbol=e.symbol)
    else:
        db_stock = StockHelper.update_stock(db_stock)
    
    try:
        db.commit()
    except Exception as e:    
        raise GetStockCommitError(e)

    db.refresh(db_stock)
    return db_stock

@dataclass
class PortfolioNotFoundError(Exception):
    portfolio_id: int

class CreatePortfolioPickCommitError(Exception):
    pass

@dataclass
class InvalidAllocationError(Exception):
    allocation: float

def create_portfolio_pick(db: Session, portfolio_id: int, pick: schemas.PickCreate) -> models.Portfolio:
    stock_symbol = pick.stock
    
    db_stock = get_stock(db, stock_symbol)

    db_portfolio = db.query(models.Portfolio).get(portfolio_id)

    if db_portfolio is None:
        raise PortfolioNotFoundError(portfolio_id=portfolio_id)

    current_allocation = 0.0
    for pick in db_portfolio.picks:
        current_allocation += pick.allocation

    if current_allocation + pick.allocation > 100.0:
        raise InvalidAllocationError(allocation=pick.allocation)

    db_pick = models.Pick(
        stock=db_stock,
        allocation=pick.allocation,
        bought_price=pick.bought_price,
        bought_date=pick.bought_date,
    )
    
    db.add(db_pick)
    db_portfolio.picks.append(db_pick)


    try:
        db.commit()
    except Exception as e:
        raise CreatePortfolioCommitError(e)

    db.refresh(db_portfolio)
    db.refresh(db_pick)
    return db_portfolio
    
class PickNotFoundError(PortfolioNotFoundError):
    pick_id: int

class PickNotInPortfolioError(PortfolioNotFoundError):
    pass
    
def delete_portfolio_pick(db: Session, portfolio_id: int, pick_id: int) -> schemas.Pick:
    db_portfolio = db.query(models.Portfolio).get(portfolio_id)

    if db_portfolio is None:
        raise PortfolioNotFoundError(portfolio_id=portfolio_id)

    in_portfolio = False
    for pick in db_portfolio.picks:
        if pick.id == pick_id:
            in_portfolio = True

    if not in_portfolio:
        raise PickNotInPortfolioError(portfolio_id=portfolio_id, pick_id=pick_id)

    db_pick = db.query(models.Pick).get(pick_id)
    schema_pick = schemas.Pick.from_orm(db_pick)
    
    if db_pick is None:
        raise PickNotFoundError(portfolio_id=portfolio_id, pick_id=pick_id)

    db.delete(db_pick)
    db.commit()
    
    return schema_pick
