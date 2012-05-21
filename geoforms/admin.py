from django.contrib.gis import admin
from models import Geoform
from models import GeoformElement
from models import FormElement
from models import Questionnaire
from models import QuestionnaireForm
from modeltranslation.admin import TranslationAdmin
from modeltranslation.admin import TranslationTabularInline
from django.conf import settings

class GeoformElementAdmin(TranslationAdmin, admin.ModelAdmin):
    list_display = ('name',
                    'html')
    ordering = ['name']

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

