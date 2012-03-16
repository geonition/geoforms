from django.shortcuts import render_to_response
from models import Questionnaire
from forms import Geoform as geoform_form
from django.template import RequestContext
from django.views.generic.base import View
from django.utils.decorators import classonlymethod
from django.forms import formsets

def questionnaire(request, questionnaire_slug):
    
    quest = Questionnaire.on_site.select_related().get(slug = questionnaire_slug)
    form_list = quest.geoforms.all()
    return render_to_response('questionnaire.html',
                             {'form_list': form_list},
                             context_instance = RequestContext(request))