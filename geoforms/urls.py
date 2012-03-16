from django.conf.urls.defaults import patterns
from django.conf.urls.defaults import url

urlpatterns = patterns('geoforms.views',
    url(r'^(?P<questionnaire_slug>[\w+(+-_)*]+)/$',
        'questionnaire',
        name="questionnaire"),
    )
