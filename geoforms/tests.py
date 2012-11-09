"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from django.test import TestCase
from django.test.client import Client


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
        