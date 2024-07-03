from django.contrib import admin
from .models import MarketRate,CachedOfferData,TrendingCoins

admin.site.register(MarketRate)
admin.site.register(CachedOfferData)
admin.site.register(TrendingCoins)