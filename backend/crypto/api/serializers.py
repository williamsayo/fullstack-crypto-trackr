from rest_framework import serializers
from .models import MarketRate,CachedOfferData,TrendingCoins

class CachedDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = CachedOfferData
        fields = '__all__'

class MarketRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketRate
        fields = '__all__'
        
class TrendingCoinSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrendingCoins
        fields = '__all__'