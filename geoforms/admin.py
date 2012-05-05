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

class ElementInline(admin.TabularInline):
    model = FormElement
    extra = 0

class GeoformAdmin(admin.ModelAdmin):
    inlines = [
        ElementInline
    ]

class QuestionnaireFormAdmin(admin.ModelAdmin):
    ordering = ['questionnaire', 'order']

class GeoformInline(admin.TabularInline):
    model = QuestionnaireForm
    extra = 0
        
class QuestionnaireAdmin(admin.OSMGeoAdmin):
    ordering = ['name']
    inlines = [
        GeoformInline
    ]

admin.site.register(GeoformElement, GeoformElementAdmin)
admin.site.register(Geoform, GeoformAdmin)
#admin.site.register(FormElement, FormElementAdmin)
admin.site.register(Questionnaire, QuestionnaireAdmin)
#admin.site.register(QuestionnaireForm, QuestionnaireFormAdmin)

