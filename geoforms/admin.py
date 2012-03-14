from django.contrib import admin
from models import Geoform
from models import GeoformElement
from models import Questionnaire
from models import QuestionnaireForm

admin.site.register(GeoformElement)
admin.site.register(Geoform)
admin.site.register(Questionnaire)
admin.site.register(QuestionnaireForm)

