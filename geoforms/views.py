from django.shortcuts import render_to_response
from models import Questionnaire
from forms import Geoform
from django.template import RequestContext
from django.views.generic.base import View
from django.utils.decorators import classonlymethod
from django.utils import translation
from django.forms import formsets
from django.contrib.formtools.wizard.views import SessionWizardView

def questionnaire(request, questionnaire_slug):
    
    quest = Questionnaire.on_site.select_related().get(slug = questionnaire_slug)
    form_list = quest.geoforms.all().order_by('questionnaireform__order')
    popup_list = form_list.filter(type = 'popup')
    form_list = form_list.filter(type = 'form')
    elements = {}
    for form in form_list:
        elements[form.slug] = form.elements.filter(lang = translation.get_language()).order_by('formelement__order', '?')
        
    return render_to_response('questionnaire.html',
                             {'form_list': form_list,
                              'popup_list': popup_list,
                              'elements': elements,
                              'questionnaire': quest,
                              'map_slug': 'questionnaire-map'},
                             context_instance = RequestContext(request))