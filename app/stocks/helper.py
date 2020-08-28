from dataclasses import dataclass

import datetime
from typing import Tuple

import nsepy
import db.models as models

get_yesterday = (lambda: datetime.date.today() - datetime.timedelta(days=1))

get_price_from_stock_history = (lambda history, date: (history.loc[date].Close, date))

@dataclass
class StockFetchError(Exception):
    symbol: str 

def get_stock_yesterday(symbol: str) -> Tuple[str, datetime.date]:
    yesterday = get_yesterday()

    try:
        symbol_info = nsepy.get_history(
            symbol=symbol,
            start=yesterday,
            end=yesterday
        )
    except:
        raise StockFetchError()

    if len(symbol_info) == 0:
        raise StockFetchError(symbol=symbol)

    return get_price_from_stock_history(symbol_info, yesterday)

"""Stock helper to fetch stock symbol information via nsepy.
"""
class StockHelper:    
    @staticmethod
    def get_stock(symbol: str, **kwargs) -> models.Stock:
        last_price, last_price_date = get_stock_yesterday(symbol)
        db_stock = models.Stock(
            symbol=symbol,
            last_price=last_price,
            last_price_date=last_price_date,
        )

        return db_stock

    @staticmethod
    def update_stock(db_stock: models.Stock) -> models.Stock:
        yesterday = get_yesterday()
        if db_stock.last_price_date != yesterday:
            last_price, last_price_date = get_stock_yesterday(db_stock.symbol)
            db_stock.last_price = last_price
            db_stock.last_price_date = last_price_date
        

        return db_stock
        