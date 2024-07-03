from django.urls import path
from .views import (GetMarketRates,
                    GetMarketRatesOfTrendingCoins,
                    GetallOffers,
                    apiOverview,
                    GetHistoricalChart,
                    GetSingleCrypto,
                    )

urlpatterns = [
    path('endpoints/', apiOverview,name='list-endpoints'),
    path('market-rates/', GetMarketRates.as_view(),name='market-rates'),
    path('market-rates/trending/', GetMarketRatesOfTrendingCoins.as_view(),name='market-rates-trending'),
    path('market-rates/history/', GetHistoricalChart.as_view(),name='market-rates-history'),
    path('crypto/<str:id>/', GetSingleCrypto.as_view(),name='crypto-coin'),
    path('offers/', GetallOffers.as_view(),name='offers'),
]
