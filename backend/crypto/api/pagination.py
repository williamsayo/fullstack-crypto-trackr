from rest_framework import pagination
from collections import OrderedDict
from rest_framework.response import Response

class CustomPagePagination(pagination.PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    page_query_param = 'page'
    max_page_size = 30
    
    def get_paginated_response(self, data):
        return Response(OrderedDict([
            ('count', self.page.paginator.count),
            ('pages',self.page.paginator.num_pages),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('results', data)
        ]))
        
class ProvidersPagePagination(pagination.PageNumberPagination):
    
    def get_paginated_response(self, data):
        return Response(data)
    