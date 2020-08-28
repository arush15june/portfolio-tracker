import datetime
from typing import List, Optional

from pydantic import BaseModel

class Stock(BaseModel):
    symbol: str
    description: str
    last_price: float
    last_price_date: datetime.date

    class Config:
        orm_mode = True

class PickBase(BaseModel):
    """Base model for handling a portfolio pick. """
    stock: str
    allocation: float
    bought_price: float
    bought_date: datetime.date

class PickCreate(PickBase):
    """Model for creating a Pick """
    pass

class Pick(PickBase):
    """Model for reading a pick """
    id: int
    stock: Stock
    pick_return: float

    class Config:
        orm_mode = True

class PortfolioBase(BaseModel):
    name: str
    description: str

class PortfolioCreate(PortfolioBase):
    pass

class Portfolio(PortfolioBase):
    id: int
    is_active: bool
    created_on: datetime.datetime
    absolute_return: float
    
    class Config:
        orm_mode = True

class PortfolioPicks(Portfolio):
    picks: List[Pick] = []
    
    class Config:
        orm_mode = True
