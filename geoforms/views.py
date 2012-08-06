from django.shortcuts import render_to_response
from geoforms.models import Questionnaire
from django.template import RequestContext
from django.views.decorators.csrf import ensure_csrf_cookie

@ensure_csrf_cookie
def questionnaire(request, questionnaire_slug):
    
    quest = Questionnaire.on_site.select_related().get(slug = questionnaire_slug)
    form_list = quest.geoforms.all().order_by('questionnaireform__order')
    elements = {}
    for form in form_list:
        elements[form.slug] = form.elements.order_by('formelement__order', '?')
    
    popup_list = form_list.filter(type = 'popup')
    form_list = form_list.filter(type = 'form')
    
    return render_to_response('questionnaire.html',
                             {'form_list': form_list,
                              'popup_list': popup_list,
                              'elements': elements,
                              'questionnaire': quest,
                              'map_slug': 'questionnaire-map'},
                             context_instance = RequestContext(request))
