from django.conf.urls import patterns
from django.conf.urls import url

urlpatterns = patterns('geoforms.views',
    url(r'^active/$',
        'get_active_questionnaires',
        name='active_questionnaires'),
    url(r'^(?P<questionnaire_slug>[\w+(+-_)*]+)/feedback$',
        'feedback',
        name="feedback"),
    url(r'^(?P<questionnaire_slug>[\w+(+-_)*]+)/lottery$',
        'lottery',
        name="lottery"),
    url(r'^(?P<questionnaire_slug>[\w+(+-_)*]+)/$',
        'questionnaire',
        name="questionnaire"),
    )
