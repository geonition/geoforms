from django.contrib.gis import admin
from models import Geoform
from models import GeoformElement
from models import FormElement
from models import Questionnaire
from models import QuestionnaireForm

admin.site.register(GeoformElement)
admin.site.register(Geoform)
admin.site.register(FormElement)
admin.site.register(Questionnaire, admin.OSMGeoAdmin)
admin.site.register(QuestionnaireForm)

