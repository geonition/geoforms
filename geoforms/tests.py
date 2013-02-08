"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from django.test import TestCase
from django.test.client import Client
from django.contrib.sites.models import Site
from django.utils import simplejson as json

from datetime import date
from datetime import timedelta

from geoforms.models import Questionnaire


class GeoformsTest(TestCase):
    
    def setUp(self):
        self.client = Client()
    
        #setup a admin
        self.admin_user = User.objects.create_user('admin', '', 'passwd')
        self.admin_user.is_staff = True
        self.admin_user.is_superuser = True
        self.admin_user.save()

    def test_drawbutton_form(self):

        self.client.login(username = 'admin', password = 'passwd')
        response = self.client.get(reverse('admin:geoforms_drawbuttonelementmodel_add'))
#        import ipdb; ipdb.set_trace()
        self.assertContains(response, 'popup', msg_prefix='no popup field')
        self.assertContains(response, 'max_amount', msg_prefix='no max_amount field')
    
    def test_get_active_questionnaires(self):
        
        site = Site.objects.get(id=1)
        # create test questionnaires
        today = date.today()
        quest1 = Questionnaire(name='test1', 
                              slug='test1',
                              area='POLYGON((0 0,1 0,1 1,1 0,0 0))',
                              start_date=today,
                              end_date=today + timedelta(days=4),
                              show_area = 1,
                              scale_visible_area=1,
                              site=site)
        quest2 = Questionnaire(name='test2', 
                              slug='test2',
                              area='POLYGON((0 0,1 0,1 1,1 0,0 0))',
                              start_date=today - timedelta(days=8),
                              end_date=today,
                              show_area = 1,
                              scale_visible_area=1,
                              site=site )
        quest3 = Questionnaire(name='test3', 
                              slug='test3',
                              area='POLYGON((0 0,1 0,1 1,1 0,0 0))',
                              start_date=today - timedelta(days=14),
                              end_date=today - timedelta(days=1),
                              show_area = 1,
                              scale_visible_area=1,
                              site=site )
        quest1.save()
        quest2.save()
        quest3.save()
        
        self.client.login(username = 'admin', password = 'passwd')
        
        response = self.client.get(reverse('active_questionnaires'))
        response_dict = json.loads(response.content)
        self.assertEqual(len(response_dict), 2)