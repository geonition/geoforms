from django.conf import settings
from django.conf.urls.defaults import patterns
from django.contrib.gis import admin
from django.core.urlresolvers import reverse
from django.forms.formsets import formset_factory
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import RequestContext
from geoforms.forms import RadioElementForm
from geoforms.forms import TextElementForm
from geoforms.forms import QuestionForm
from models import Geoform
from models import GeoformElement
from models import FormElement
from models import Questionnaire
from models import QuestionnaireForm
from modeltranslation.admin import TranslationAdmin
from modeltranslation.admin import TranslationTabularInline

class GeoformElementAdmin(TranslationAdmin, admin.ModelAdmin):
    list_display = ('name',
                    'html')
    ordering = ['name']
    
    def get_urls(self):
        urls = super(GeoformElementAdmin, self).get_urls()
        
        extra_urls = patterns('',
                            (r'^add_text_element/$', self.admin_site.admin_view(self.create_text_element)),
                            (r'^add_radio_element/$', self.admin_site.admin_view(self.create_radio_element)),
                            )
        return extra_urls + urls
    
    def create_text_element(self, request):
        if request.method == 'POST':
            TextElementForm(request.POST).save()
            return HttpResponseRedirect(reverse('admin:geoforms_geoformelement_changelist'))
        else:
            return render_to_response('admin/geoforms/geoformelement/create_element.html',
                                      {'current_app': self.admin_site.name,
                                       'form': TextElementForm()},
                                      context_instance = RequestContext(request))
    
    def create_radio_element(self, request):
        if request.method == 'POST':
            print request.POST
            RadioElementForm(request.POST).save()
            return HttpResponseRedirect(reverse('admin:geoforms_geoformelement_changelist'))
        else:
            return render_to_response('admin/geoforms/geoformelement/create_element.html',
                                      {'current_app': self.admin_site.name,
                                       'form': QuestionForm(),
                                       'formset': formset_factory(RadioElementForm)},
                                      context_instance = RequestContext(request))

class FormElementAdmin(admin.ModelAdmin):
    ordering = ['geoform', 'order']

class ElementInline(TranslationTabularInline):
    model = FormElement
    extra = 0

class GeoformAdmin(TranslationAdmin, admin.ModelAdmin):
    list_display = ('name',)
    inlines = [
        ElementInline
    ]

class QuestionnaireFormAdmin(admin.ModelAdmin):
    ordering = ['questionnaire', 'order']

class GeoformInline(TranslationTabularInline):
    model = QuestionnaireForm
    extra = 0
        
class QuestionnaireAdmin(admin.OSMGeoAdmin, TranslationAdmin):
    list_display = ('name',)
    ordering = ['name']
    inlines = [
        GeoformInline
    ]
    default_lon = getattr(settings,
                          'ORGANIZATION_ADMIN_DEFAULT_MAP_SETTINGS',
                          {'default_lon': 0})['default_lon']
    default_lat = getattr(settings,
                          'ORGANIZATION_ADMIN_DEFAULT_MAP_SETTINGS',
                          {'default_lat': 0})['default_lat']
    default_zoom = getattr(settings,
                          'ORGANIZATION_ADMIN_DEFAULT_MAP_SETTINGS',
                          {'default_zoom': 4})['default_zoom'] 
    
admin.site.register(GeoformElement, GeoformElementAdmin)
admin.site.register(Geoform, GeoformAdmin)
admin.site.register(Questionnaire, QuestionnaireAdmin)

