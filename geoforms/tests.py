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

from django.template.defaultfilters import slugify

from geoforms.models import GeoformElement
from geoforms.models import CheckboxElementModel
from geoforms.models import DrawbuttonElementModel
from geoforms.models import ParagraphElementModel
from geoforms.models import NumberElementModel
from geoforms.models import RadioElementModel
from geoforms.models import TextElementModel
from geoforms.models import TextareaModel
from geoforms.models import RangeElementModel
from geoforms.models import Geoform
from geoforms.models import PopupModel
from geoforms.models import PageModel
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
        self.assertEqual(len(response_dict['questionnaires']), 2)

    def test_slug_validity(self):

        test_html = '<span>This is <b>TEST</b></span>'

        checkbox = CheckboxElementModel(name='cb1',
                                        html=test_html)

        checkbox.save()
        self.assertEqual(checkbox.slug, slugify("%s %s" % (checkbox.name, checkbox.id))[:200])

        drawbutton = DrawbuttonElementModel(name='db1',
                                        html=test_html)

        drawbutton.save()
        self.assertEqual(drawbutton.slug, slugify("%s %s" % (drawbutton.name, drawbutton.id))[:200])

        geoformelement = GeoformElement(name='gf1',
                                        html=test_html)

        geoformelement.save()
        self.assertEqual(geoformelement.slug, slugify("%s %s" % (geoformelement.name, geoformelement.id))[:200])

        paragraphelement = ParagraphElementModel(name='pg1',
                                        html=test_html)

        paragraphelement.save()
        self.assertEqual(paragraphelement.slug, slugify("%s %s" % (paragraphelement.name, paragraphelement.id))[:200])

        numberelement = NumberElementModel(name='num1',
                                        html=test_html)

        numberelement.save()
        self.assertEqual(numberelement.slug, slugify("%s %s" % (numberelement.name, numberelement.id))[:200])

        radioelement = RadioElementModel(name='rb1',
                                        html=test_html)

        radioelement.save()
        self.assertEqual(radioelement.slug, slugify("%s %s" % (radioelement.name, radioelement.id))[:200])

        textelement = TextElementModel(name='txt1',
                                        html=test_html)

        textelement.save()
        self.assertEqual(textelement.slug, slugify("%s %s" % (textelement.name, textelement.id))[:200])

        textareaelement = TextareaModel(name='txta1',
                                        html=test_html)

        textareaelement.save()
        self.assertEqual(textareaelement.slug, slugify("%s %s" % (textareaelement.name, textareaelement.id))[:200])

        rangeelement = RangeElementModel(name='rn1',
                                        html=test_html)

        rangeelement.save()
        self.assertEqual(rangeelement.slug, slugify("%s %s" % (rangeelement.name, rangeelement.id))[:200])


        geoform = Geoform(name='geoform1')

        geoform.save()
        self.assertEqual(geoform.slug, slugify("%s %s" % (geoform.name, geoform.id))[:200])

        popup = PopupModel(name='popup1')

        popup.save()
        self.assertEqual(popup.slug, slugify("%s %s" % (popup.name, popup.id))[:200])

        page = PageModel(name='page1')

        page.save()
        self.assertEqual(page.slug, slugify("%s %s" % (page.name, page.id))[:200])

        # create test questionnaire
        site = Site.objects.get(id=1)

        today = date.today()
        quest = Questionnaire(name='quest1',
                              area='POLYGON((0 0,1 0,1 1,1 0,0 0))',
                              start_date=today,
                              end_date=today + timedelta(days=4),
                              show_area = 1,
                              scale_visible_area=1,
                              site=site)

        quest.save()
        self.assertEqual(quest.slug, slugify("%s %s" % (quest.name, quest.id))[:200])

