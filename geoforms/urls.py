from django.conf.urls.defaults import patterns
from django.conf.urls.defaults import url

urlpatterns = patterns('geoforms.views',
    url(r'^(?P<questionnaire_slug>[\w+(+-_)*]+)/hslfeedback$',
        'hslfeedback',
        name="hslfeedback"),
    url(r'^(?P<questionnaire_slug>[\w+(+-_)*]+)/feedback$',
        'feedback',
        name="feedback"),
    url(r'^(?P<questionnaire_slug>[\w+(+-_)*]+)/$',
        'questionnaire',
        name="questionnaire"),
    )
