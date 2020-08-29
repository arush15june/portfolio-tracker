import datetime
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Date, Float
from sqlalchemy.orm import relationship

from .database import Base

class Portfolio(Base):
    """Portfolio model to hold a single portfolio with multiple stock picks.
    """
    __tablename__ = "portfolio"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    
    is_active = Column(Boolean, default=True)
    created_on = Column(DateTime, default=datetime.datetime.utcnow)
    edited_on = Column(DateTime, default=datetime.datetime.utcnow)

    picks = relationship("Pick", backref="portfolio", order_by="desc(Pick.bought_date)")

    @property
    def absolute_return(self):
        absolute_return = 0.0
        
        for pick in self.picks:
            allocation = pick.allocation/100.0
            bought_price = pick.bought_price
            bought_date = pick.bought_date
            stock_price = pick.stock.last_price
            stock_date = pick.stock.last_price_date

            absolute_return += allocation*((stock_price/bought_price) - 1.00)

        return absolute_return*100

class Pick(Base):
    """Pick model to hold a stock pick in a portfolio.
    """
    __tablename__ = "pick"

    id = Column(Integer, primary_key=True, index=True)

    stock_symbol =  Column(String, ForeignKey("stock.symbol"))
    stock = relationship("Stock", uselist=False)
    
    allocation = Column(Float, default=0.0)
    bought_price = Column(Float, default=0.0)
    bought_date = Column(Date, default=datetime.date.today)
    
    portfolio_id = Column(Integer, ForeignKey("portfolio.id"))

    @property
    def pick_return(self):
        return (self.stock.last_price/self.bought_price - 1.00)*100

class Stock(Base):
    __tablename__ = "stock"
    symbol = Column(String, primary_key=True, index=True)
    description = Column(String, default="")
    last_price = Column(Float)
    last_price_date = Column(Date)


