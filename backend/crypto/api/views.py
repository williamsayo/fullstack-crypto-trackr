from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import MarketRateSerializer,CachedDataSerializer,TrendingCoinSerializer
from .models import MarketRate,CachedOfferData,TrendingCoins
from .cache import cache
from .pagination import CustomPagePagination,ProvidersPagePagination
import requests
import random
import datetime

@api_view(['GET'])
def apiOverview(request):
    api_urls = {
        'GetAllOffers': '/offers/?fromCurrency=currency&amount=amount&toCurrency=currency',
        'GetMarketRates': '/market-rates/?currency=currency',
        'GetTrendingMarketRates':'/market-rates/trending/?currency=currency',
    }
    
    return Response(api_urls,status=status.HTTP_200_OK)

class GetallOffers(APIView, ProvidersPagePagination):
    def get(self, request, format=None):
        data = request.query_params
        if data:
            offers = CachedOfferData.objects.filter(currency=data['fromCurrency'].lower(),cryptoCurrency=data['toCurrency'].lower(),currencyAmount=data['amount']).order_by('-cacheDate','-cryptoAmount')[:4]
            if offers.exists():  
                paginated_page = self.paginate_queryset(offers,request)
                serializer = CachedDataSerializer(paginated_page,many=True)
                return self.get_paginated_response(serializer.data)
            
            response = getAllOffers(data['amount'],data['fromCurrency'],data['toCurrency'])
        
        else:
            response = {'data':{'message':'query params missing'},'status':status.HTTP_400_BAD_REQUEST}
        
            
        return Response(response['data'],status=response['status'])
        
class GetMarketRatesOfTrendingCoins(APIView,CustomPagePagination):
    def get(self, request, format=None):
        currency = request.query_params.get('currency','').lower()
        market_rates = TrendingCoins.objects.filter(currencyCode=currency)[:10]
        
        if not market_rates.exists():
            cache.scheduleUpdateTrending(currency)
            market_rates = TrendingCoins.objects.filter(currencyCode=currency)[:10]
            
        market_rates = [data for data in market_rates]
        market_rates.reverse()
           
        paginated_page = self.paginate_queryset(market_rates,request)
        serializer = TrendingCoinSerializer(paginated_page,many=True)
        return self.get_paginated_response(serializer.data)
        
class GetMarketRates(APIView, CustomPagePagination):  
    def get(self, request, format=None): 
        currency = request.query_params.get('currency','').lower()
        searchParam = request.query_params.get('q')
        market_rates = MarketRate.objects.filter(currencyCode=currency)[:100]
        
        if not market_rates.exists():
            cache.scheduleUpdateMarketRate(currency)
            market_rates = MarketRate.objects.filter(currencyCode=currency)[:100]
            
        market_rates = [data for data in market_rates]
        market_rates.reverse()
        
        if searchParam is not None:
            market_rates = [data for data in market_rates if searchParam.lower() in (data.cryptoCurrency.lower() or data.cryptoCurrency.lower())]
            
        paginated_page = self.paginate_queryset(market_rates,request)
        serializer = MarketRateSerializer(paginated_page,many=True)
        return self.get_paginated_response(serializer.data)

class GetHistoricalChart(APIView):
    def get(self, request, format=None):
        currency = request.query_params.get('currency','').lower()
        id = request.query_params.get('id','').lower()
        days = request.query_params.get('days','').lower()
        
        if not days:
            days = 300
            
        if (id and currency):
            url = f'https://api.coingecko.com/api/v3/coins/{id}/market_chart?vs_currency={currency}&days={days}'
            headers = {"accept": "application/json"}
            
            # for i in response:
            #     print(datetime.datetime.fromtimestamp(response.get('prices')[i][0]/1000))
            
            response = makeApiRequest(url,headers)
            res_status = status.HTTP_200_OK
            
        else:
            response = {'message':'"ID" and "CURRENCY" required'}
            res_status = status.HTTP_400_BAD_REQUEST
        
        return Response(response,status=res_status)

class GetSingleCrypto(APIView):
    def get(self, request, id , format=None): 
        url = f'https://api.coingecko.com/api/v3/coins/{id}'
        headers = {"accept": "application/json"}
        
        response = makeApiRequest(url,headers=headers)
        
        return Response(response,status=status.HTTP_200_OK)

def makeApiRequest(url,headers=None,json=None,method='GET'):
    if method == 'POST':
        response = requests.post(url=url+'&x_cg_api_key=CG-1HxrWkaUwcWMs8c1RmTAVG64',json=json,headers=headers)
    
    else:    
        response = requests.get(url=url,json=json,headers=headers)
    
    return response.json()      

def currenciesList():
    url = "https://api.coingecko.com/api/v3/simple/supported_vs_currencies?x_cg_api_key=CG-1HxrWkaUwcWMs8c1RmTAVG64"
    headers = {"accept": "application/json"}
    response = makeApiRequest(url,headers)
    
    return response

def coinList(currency):
    url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false'
    headers = {"accept": "application/json"}
    response = makeApiRequest(url,headers)
    
    return response
    
def getAllOffers(amount,fromCurrency,cryptoCurrencyCode):
    datas = []
    def getOfferFromPaybis():
        response = requests.post('https://api.paybis.com/public/processing/v2/quote/buy-crypto',
        json={
        "currencyCodeFrom":fromCurrency.upper(),
        "currencyCodeTo":cryptoCurrencyCode.upper(),
        "requestedAmount":{"amount":str(amount),"currencyCode":fromCurrency.upper()},
        "requestedAmountType":"from",
        "promoCode":None,
        "paymentMethod":"credit-card"
        })
        if response.status_code == 200:
            data = response.json()
            datas.append({
                'id':random.random(),
                'provider':'paybis',
                'fromCurrency':fromCurrency,
                'cryptoCurrency':cryptoCurrencyCode,
                'currencyAmount':amount,
                'cryptoAmount':float(data['paymentMethods'][0]['amountTo']['amount']),
            })
        # return data['paymentMethods'][0]['amountTo']['amount']

    def getOfferFromGuardian():
        response = requests.get(
        f'https://api-payments.guardarian.com/v1/estimate?to_currency={cryptoCurrencyCode}&from_amount={amount}&from_currency={fromCurrency}&from_network={fromCurrency}&to_network={cryptoCurrencyCode}',
            headers={
            'X-Api-Key': 'c14d927f-cb01-4561-9520-28ec22c92710',
            }
        )
        if response.status_code == 200:
            data = response.json()
            datas.append({
                    'id':random.random(),
                    'provider':'guardian',
                    'fromCurrency':fromCurrency,
                    'cryptoCurrency':cryptoCurrencyCode,
                    'currencyAmount':amount,
                    'cryptoAmount':float(data['value'])
                    })
            
        # return data['value']

    def getOfferFromMoonPay():
        response =  requests.get(f'https://api.moonpay.com/v3/currencies/{cryptoCurrencyCode}/buy_quote?apiKey=pk_live_R5Lf25uBfNZyKwccAZpzcxuL3ZdJ3Hc&baseCurrencyAmount={amount}&baseCurrencyCode={fromCurrency}&fixed=true&areFeesIncluded=true&regionalPricing=true&quoteType=principal')
        
        if response.status_code == 200:
            data = response.json()
            datas.append({
                'id':random.random(),
                'provider':'moonpay',
                'fromCurrency':fromCurrency,
                'cryptoCurrency':cryptoCurrencyCode,
                'currencyAmount':amount,
                'cryptoAmount':float(data['quoteCurrencyAmount'])
                })
        # return data['quoteCurrencyAmount']

    def getOfferFromTansack():
        response = requests.get(f'https://api.transak.com/api/v1/pricing/public/quotes?fiatCurrency={fromCurrency.upper()}&cryptoCurrency={cryptoCurrencyCode.upper()}&paymentMethod=credit_debit_card&isBuyOrSell=BUY&fiatAmount={amount}&partnerApiKey=02624956-010b-4775-8e31-7b9c8b82df76&network=mainnet')
        if response.status_code == 200:
            data = response.json()
            datas.append({
                'id':random.random(),
                'provider':'tansack',
                'fromCurrency':fromCurrency,
                'cryptoCurrency':cryptoCurrencyCode,
                'currencyAmount':amount,
                'cryptoAmount':float(data['response']['cryptoAmount'])
                })
            
        # return data['response']['cryptoAmount']
    
    try:
        getOfferFromPaybis()
        getOfferFromGuardian()
        getOfferFromMoonPay()
        getOfferFromTansack()
        
        
        response = {'data':datas,
            'status':status.HTTP_200_OK}
            
    except Exception as e:
        response = {'data':{'message':'An internal error occured'},'status':status.HTTP_500_INTERNAL_SERVER_ERROR}
            
    return response