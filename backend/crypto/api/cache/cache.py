from ..views import makeApiRequest,getAllOffers
from ..models import MarketRate,CachedOfferData,TrendingCoins
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from django.conf import settings

from django.core.management.base import BaseCommand
from django_apscheduler.jobstores import DjangoJobStore
from django_apscheduler.models import DjangoJobExecution
from django_apscheduler import util
import logging

logger = logging.getLogger(__name__)

def scheduleUpdateTrending(currency):
    url =f'https://api.coingecko.com/api/v3/coins/markets?vs_currency={currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h&x_cg_api_key=CG-1HxrWkaUwcWMs8c1RmTAVG64'
    headers = {"accept": "application/json"}
    
    try:
        response = makeApiRequest(url,headers)
        for data in response:
            trendingCoins = TrendingCoins(
                        currencyCode=currency,
                        icon=data.get('image'),
                        cryptoCurrency=data.get('name'),
                        symbol=data.get('symbol'),
                        price=float(data.get('current_price')),
                        change_24h=data.get('price_change_percentage_24h'),
                        marketCap=data.get('market_cap'),
                        volume_24h=data.get('total_volume'),
                        )
            trendingCoins.save()
            
        return
            
    except Exception as e:
        print(e.args)

def scheduleUpdateMarketRate(currency):
    url =f'https://api.coingecko.com/api/v3/coins/markets?vs_currency={currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false'
    headers = {"accept": "application/json"}
    
    try:
        response = makeApiRequest(url,headers)
        print(response)
        for data in response:
            market_rate_obj = MarketRate(
                        currencyCode=currency,
                        icon=data.get('image'),
                        cryptoCurrency=data.get('name'),
                        symbol=data.get('symbol'),
                        price=float(data.get('current_price')),
                        change_24h=data.get('price_change_percentage_24h'),
                        marketCap=data.get('market_cap'),
                        volume_24h=data.get('total_volume'),
                        )
            market_rate_obj.save()
            
        return
            
    except Exception as e:
        print(e.args)
        
def scheduleCacheOffers(data):
    amount = data['amount']
    fromCurrency = data['fromCurrency']
    toCurrency = data['toCurrency']
    
    try:
        response = getAllOffers(amount,fromCurrency,toCurrency)
    
        for provider,value in response['data'].items():
            cachedData = CachedOfferData(provider=provider,
                                        currency=fromCurrency,
                                        currencyAmount=float(amount),
                                        cryptoCurrency=toCurrency,
                                        cryptoAmount=float(value),
                                        )
            cachedData.save()
            
    except Exception as e:
        print(e.args)

def cacheMarketRate():
    scheduleUpdateMarketRate('usd')

def cacheTrending():
    scheduleUpdateTrending('usd')
    
def cacheOffers():
    scheduleCacheOffers({'amount':'100','fromCurrency':'usd','toCurrency':'btc'})

@util.close_old_connections
def delete_old_job_executions(max_age=604_800):
    DjangoJobExecution.objects.delete_old_job_executions(max_age)


class Command(BaseCommand):
  help = "Runs APScheduler."

  def handle(self, *args, **options):
    scheduler = BackgroundScheduler(timezone=settings.TIME_ZONE)
    scheduler.add_jobstore(DjangoJobStore(), "default")

    scheduler.add_job(
                    cacheMarketRate,
                    trigger=CronTrigger(
                    day_of_week="0-6", hour="00", minute="00"
                    ),
                    id="cache_market_rate",
                    max_instances=1,
                    replace_existing=True,
                    )
    logger.info("Added job 'cache_market_rate'.")
    
    scheduler.add_job(
                    cacheTrending,
                    trigger=CronTrigger(
                    day_of_week="0-6", hour="00", minute="00"
                    ),
                    id="cache_market_rate",
                    max_instances=1,
                    replace_existing=True,
                    )
    logger.info("Added job 'cache_Trending'.")
    
    scheduler.add_job(
                    cacheOffers,
                    trigger=CronTrigger(hour="*/1"),
                    id="cache_offers",
                    max_instances=1,
                    replace_existing=True,
                    )
    logger.info("Added job 'cache_offers'.")

    scheduler.add_job(
      delete_old_job_executions,
      trigger=CronTrigger(
        day_of_week="mon", hour="00", minute="00"
      ),
      id="delete_old_job_executions",
      max_instances=1,
      replace_existing=True,
    )
    logger.info(
      "Added weekly job: 'delete_old_job_executions'."
    )

    try:
      logger.info("Starting scheduler...")
      scheduler.start()
      
    except KeyboardInterrupt:
      logger.info("Stopping scheduler...")
      
      scheduler.shutdown()
      
      logger.info("Scheduler shut down successfully!")