from django.contrib.gis import admin
from models import Geoform
from models import GeoformElement
from models import FormElement
from models import Questionnaire
from models import QuestionnaireForm

class GeoformElementAdmin(admin.ModelAdmin):
    ordering = ['name']

class FormElementAdmin(admin.ModelAdmin):
    ordering = ['geoform', 'order']
    
admin.site.register(GeoformElement, GeoformElementAdmin)
admin.site.register(Geoform)
admin.site.register(FormElement, FormElementAdmin)
admin.site.register(Questionnaire, admin.OSMGeoAdmin)
admin.site.register(QuestionnaireForm)

