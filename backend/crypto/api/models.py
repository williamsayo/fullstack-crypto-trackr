from django.db import models

cryptoCurrency = [('BTC','Bitcoin'),
                  ('ETH','Ethereum'),
                  ('SOL','Solana')]

currency = [('USD','United States dollar'),
            ('EUR','Euro'),
            ('GPB','Pound Sterling'),
            ('NGN','Nigerian Naira'),
            ('AUD','Australian dollar')]

class CachedOfferData(models.Model):
    provider = models.CharField(max_length=30,null=False,blank=False)
    currency = models.CharField(choices=currency,null=False,blank=False,max_length=30,default=currency[0][0])
    currencyAmount = models.FloatField(null=False,blank=False)
    cryptoCurrency = models.CharField(choices=cryptoCurrency,null=False,blank=False,max_length=30,default=cryptoCurrency[0][0])
    cryptoAmount = models.FloatField(null=False,blank=False)
    cacheDate = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Cached Offer'
        verbose_name_plural = 'Cached Offers'

    def __str__(self):
        return '%s %s %s - %.6f %s '%(self.provider,self.currencyAmount,self.currency,self.cryptoAmount,self.cryptoCurrency)
    
class MarketRate(models.Model):
    currencyCode = models.CharField(max_length=20)
    cryptoCurrency = models.CharField(max_length=20)
    symbol = models.CharField(max_length=5,default='btc')
    price = models.FloatField(null=False,blank=False)
    change_24h = models.FloatField(null=False,blank=False)
    marketCap = models.FloatField(null=False,blank=False)
    volume_24h = models.FloatField(null=False,blank=False)
    icon = models.URLField(null=True,blank=True)
    date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date']

    def __str__(self):
        return '%s - %d %s '%(self.currencyCode,self.price,self.cryptoCurrency)
    
class TrendingCoins(models.Model):
    currencyCode = models.CharField(max_length=20)
    cryptoCurrency = models.CharField(max_length=20)
    symbol = models.CharField(max_length=5)
    price = models.FloatField(null=False,blank=False)
    change_24h = models.FloatField(null=False,blank=False)
    marketCap = models.FloatField(null=False,blank=False)
    volume_24h = models.FloatField(null=False,blank=False)
    icon = models.URLField(null=True,blank=True)
    date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Trending Coin'
        verbose_name_plural = 'Trending Coins'
        ordering = ['-date']

    def __str__(self):
        return self.cryptoCurrency